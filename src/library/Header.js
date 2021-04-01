import { Button, Menu, Dropdown } from 'antd'
import { PlusOutlined, MenuOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

const Header = ({ history }) => {
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => history.push("/")}>Lista de álbumes</Menu.Item>
            <Menu.Item key="2" onClick={() => history.push("/add")}>Añadir álbum</Menu.Item>
            <Menu.Item key="3" onClick={() => history.push("/areas")}>Gestionar áreas</Menu.Item>
        </Menu>
    )

    return (
        <Wrapper>
            <h1 onClick={() => history.push("/")}>Organizador de discos</h1>
            {/* <Button onClick={() => history.push("/add")} icon={<PlusOutlined style={{ marginTop: 4 }} />}>Añadir disco</Button> */}
            <Dropdown overlay={menu}>
                <Button icon={<MenuOutlined />}>Menú</Button>
            </Dropdown>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
    height: 70px;
    background: white;
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.1);
    h1{
        cursor: pointer;
        margin: 0;
        color: rgba(0, 0, 0, 0.8);
    }
`

export default withRouter(Header)