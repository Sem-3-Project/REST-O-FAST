import Axios from 'axios';
import React from 'react';
import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarMenu,
  SidebarLink,
  SidebarRoute,
  SideBtnWrap
} from './SidebarElements';

const Sidebar = ({ isOpen, toggle }) => {
  const name = localStorage.getItem('Name');

  const clearUser = (tableid) => {
    Axios.post('http://localhost:3001/api/clearUserDetails', {
      tid: tableid,
    }).then(res => console.log(res.data.msg))
  }

  const jumpToLogin = () => {
    const tableNumber = localStorage.getItem('TableId');
    const redirectString = '/home/' + tableNumber
    clearUser(tableNumber)
    localStorage.clear();
    window.location.href = redirectString
  }

  const jumpToProductPage = () => {
    window.location.href = '/productTable'
  }

  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarMenu>
        {name}
        <SidebarLink onClick={() => window.location.href = '/productTable/products/1'}>South Indian</SidebarLink>
        <SidebarLink onClick={() => window.location.href = '/productTable/products/2'}>ITALIAN</SidebarLink>
        <SidebarLink onClick={() => window.location.href = '/productTable/products/3'}>PAV BHAJI</SidebarLink>
        <SidebarLink onClick={() => window.location.href = '/productTable/products/4'}>DESSERTS</SidebarLink>
        <SidebarLink onClick={() => window.location.href = '/productTable/products/5'}>NORTH INDIAN</SidebarLink>
        <SidebarLink onClick={jumpToProductPage}>Full Menu</SidebarLink>
      </SidebarMenu>
      <SideBtnWrap>
        {name &&
          <SidebarRoute onClick={jumpToLogin}>Logout</SidebarRoute>
        }
        {!name &&
          <SidebarRoute onClick={() => {
            Axios.post('http://localhost:3001/api/checkIfLoggedIn',
              {
                tableId: localStorage.getItem("tempTableId")
              }).then(res => {
                let flag = res.data.res
                // console.log(res.data.res)
                if (flag === 0) { //Not logged in!
                  //alert("Dear user please log in to continue the order process!")
                  window.location.href = '/login'
                }
                else {
                  alert("The login for this table has been done! Please order by that login! 1 Table 1 login!")
                }
              })
          }}
          >
            Login
            </SidebarRoute>
        }
        {/* <a href='/login'>Logout</a> */}
      </SideBtnWrap>
    </SidebarContainer>
  );
};

export default Sidebar;
