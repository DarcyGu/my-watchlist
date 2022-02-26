import React, { Component } from 'react';
import { getStorage, setStorage } from '../../useLocalStorage';
import ajax from 'ajax';
import { DashboardContainer } from './style';
import logo from './binance-logo.svg';
import Select from 'react-select';

const df = {
    BTCUSDT: {base: 'BTC', quote: 'USDT'}, 
    ETHUSDT: {base: 'ETH', quote: 'USDT'}, 
};

export default class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watchlist: getStorage('watchlist') || df,
            prices: {},
            symbols: []
        }
        this.onAdd = this.onAdd.bind(this)
    }

    componentDidMount() {

        ajax.get({
            url: `https://api.binance.com/api/v3/ticker/24hr`
        }).then(result=>{
            const {prices} = this.state;
            result.forEach(r=>{
                prices[r.symbol] = {
                    price: +r.lastPrice,
                    percent: +r.priceChangePercent
                }
            })
            this.setState({prices})
        })

        // const ws = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr");
        this.ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");
        
        this.ws.onmessage = (message) => {
            const {prices} = this.state;
            const result = JSON.parse(message.data);
            result.forEach(r=>{
                // const w = watchlist[r.s];
                // if(w){
                    const price = +r.c;
                    // w.lastPrice = price;
                    prices[r.s] = {
                        price: price,
                        percent: +r.P
                    };
                    // console.log(r.s, price)
                // }
            })
            this.setState({
                // watchlist,
                prices
            })
        };

        ajax.get({
            url: 'https://api.binance.com/api/v1/exchangeInfo'
        }).then(result=>{
            this.setState({symbols: result.symbols.filter(s=>s.status==='TRADING' && ['USDT','AUD'].includes(s.quoteAsset))})
        })
    }

    componentWillUnmount(){
        if(this.ws){
            this.ws.close();
        }
    }

    // getPrice(symbol){
    //     ajax.get({
    //         url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    //     }).then(result=>{
    //         const {prices} = this.state;
    //         prices[symbol] = +result.price;
    //         this.setState({prices})
    //     })
    // }

    onAdd(index){
        const {watchlist, symbols} = this.state;
        const v = symbols[index];
        watchlist[v.symbol] = {
            base: v.baseAsset,
            quote: v.quoteAsset
        }; 
        this.setState({watchlist});
        setStorage('watchlist', watchlist);
        // this.getPrice(v.symbol);
    }

    onRemove(k){
        return () => {
            const {watchlist} = this.state;
            delete watchlist[k];
            this.setState({watchlist});
            setStorage('watchlist', watchlist);
        }
    }

    render() {
        const {watchlist, prices, symbols} = this.state;

        return (
            <DashboardContainer>
                <div className='title'>
                    <div style={{marginBottom:8}}>My Watchlist</div>
                    <img src={logo} style={{width:120}} alt='Binance Logo' />
                </div>
                <div className='table-container'>
                    <table>
                        <tbody>
                            {
                                Object.keys(watchlist).map(k=>{
                                    const w = watchlist[k];
                                    return (
                                        <tr key={k}>
                                            <th width='35%'>
                                                <a href={`https://www.binance.com/en/trade/${w.base}_${w.quote}`}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    {w.base}
                                                    <span style={{fontWeight:400, fontSize:13}}> / {w.quote}</span>
                                                </a>
                                            </th>
                                            <td width='30%' style={{textAlign:'right',fontWeight:500}}>{prices[k]?.price}</td>
                                            <td width='30%' style={{textAlign:'right',padding:'0 2px'}}>
                                                {prices[k] && 
                                                <div style={{
                                                    background: prices[k].percent<0?'#e35e5e':'#2ead65',
                                                    color: 'white',
                                                    textAlign:'center',
                                                    padding:'4px 0',
                                                    width: 70,
                                                    borderRadius: 4,
                                                    fontSize:14,
                                                    fontWeight:500,
                                                    display: 'inline-block'
                                                }}>
                                                    {prices[k].percent>0&&'+'}{prices[k].percent.toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                                    %
                                                </div>
                                               }
                                            </td>
                                            <td width='5%' style={{paddingLeft:8}}>
                                                <i className='fa fa-minus' onClick={this.onRemove(k)} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={4}>
                                    <Select 
                                        className='react-select-container'
                                        classNamePrefix='react-select'
                                        placeholder='Search...'
                                        styles={customStyles}
                                        value={null}
                                        onChange={option => {this.onAdd(option.value)}}
                                        options={symbols.map((s,i)=>({value: i, label: `${s.baseAsset}/${s.quoteAsset}`}))}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='flex-center' style={{marginTop:32}}>
                    <i onClick={()=>window.location.reload()} className='fa fa-sync' />
                </div>
            </DashboardContainer>
        )
    }
}

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        background: '#3E404D'
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: '4px'
    }),
    option: (provided, state) => ({
        ...provided,
        height: 32,
        lineHeight: '32px',
        background: state.isSelected || state.isFocused ? '#30303C' : 'unset',
        padding: '0 12px',
        cursor: 'pointer',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '&:hover': {
            background: '#30303C'
        }
    }),
}