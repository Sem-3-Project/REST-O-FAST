import styled from 'styled-components';
import { AccountBox } from './accountBox';


const AppContainer = styled.div`
width : 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

function Login(props) {
    return (
        <AppContainer>
            <AccountBox tableNumber={props.match.params.id} />
        </AppContainer>
    );
}

export default Login