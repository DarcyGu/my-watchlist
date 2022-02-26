import styled from 'styled-components/macro';

export const DashboardContainer = styled.div`

    padding: 50px 20px;

    .title {
        font-size: 32px;
        font-weight: 500;
        letter-spacing: 1.62px;
        margin-bottom: 31px;
        margin-left: 8px;
        text-align: center;
    }

    .table-container {
        background-color: rgb(48, 48, 60);
        max-width: 400px;
        margin: auto;
        padding: 20px;
        font-size: 18px;
    }

    table {
        width: 100%;
        text-align: left;
        border-collapse: collapse;
        color: rgba(230, 235, 255, 0.7);
        tr {
            &:not(:last-child){
                border-bottom: 1px solid rgba(230, 235, 255, 0.7);
            }
            
        }
        th, td {
            padding: 16px 2px;
        }

        a, .fa-minus {
            transition: color 0.2s ease;
            &:hover {
                color: white;
            }
        }

        .fa-minus {
            cursor: pointer;
        }
    }

    select {
        color: black;
        width: 100%;
    }

    .react-select__control {
        background: #23232CB3;
        border: 1px solid transparent;
        border-radius: 2px;
        box-shadow: none;
        min-height: 40px;
        cursor: pointer;
        color: #E6EBFFB3;
        &:hover {
            border-color: transparent;
            background: #23232C;
        }
    }
    .react-select__single-value {
        color: inherit;
    }
    .react-select__input {
        color: white !important;
    }
    .react-select__placeholder {
        color: inherit;
    }
    .react-select__indicator {
        color: inherit;
        &:hover {
            color: inherit;
        }
    }
    .react-select__clear-indicator {
        > svg {
            height: 16px;
            width: 16px;
        }
    }
    .react-select__indicator-separator {
        display: none;
    }
`;