import React, { useState, useRef } from 'react'
import { BodyWrapper } from '../library'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ZONES } from '../graphql/queries'
import { CREATE_ZONE, UPDATE_ZONE, DELETE_ZONE } from '../graphql/mutations'
import { Table, Tag, Button, Modal, Popover, Input, message } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

const Areas = () => {
    const { loading, data } = useQuery(GET_ZONES, { fetchPolicy: "network-only" })
    const [zoneName, setZoneName] = useState("")
    const [openPopover, setOpenPopover] = useState()
    const [createZoneModal, setCreateZoneModal] = useState(false)

    const [createZone, { loading: loadingCreate }] = useMutation(CREATE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [updateZone, { loading: loadingUpdate }] = useMutation(UPDATE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [deleteZone, { loading: loadingDelete }] = useMutation(DELETE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
 
    const columns = [
        {
            title: "Área",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Número de álbumes",
            key: "n",
            render: item => item?.length || 0
        },
        {
            key: "btn",
            render: item => {
                return (
                    <div key={item.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Popover 
                            trigger="click" 
                            visible={openPopover === "edit"+item.id} 
                            onClick={() => setZoneName(item.name)} 
                            onVisibleChange={bool => setOpenPopover(bool && "edit"+item.id)}
                            content={
                                <div>
                                    Nuevo nombre
                                    <Input value={zoneName} onChange={evt => setZoneName(evt.target.value)}/>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
                                        <Button 
                                            type="default" 
                                            onClick={() => {
                                                setOpenPopover(false)
                                                setZoneName("")
                                            }}
                                        >Cancelar</Button>&nbsp;&nbsp;
                                        <Button 
                                            type="primary" 
                                            loading={loadingUpdate}
                                            onClick={async () => {
                                                await updateZone({ variables: {
                                                    id: item.id,
                                                    name: zoneName
                                                }})
                                                setZoneName("")
                                                setOpenPopover(false)
                                            }}
                                        >Editar</Button>
                                    </div>
                                </div>
                            }
                        >
                            <Tag 
                                color="warning" 
                                style={{ cursor: "pointer" }}
                            ><EditOutlined /> Renombrar</Tag>
                        </Popover>
                        <Popover 
                            trigger="click" 
                            visible={openPopover === "delete"+item.id}
                            onVisibleChange={bool => setOpenPopover(bool && "delete"+item.id)}
                            placement="left" 
                            content={
                                <div>
                                    <p>¿Estás seguro de que deseas eliminar el área <b>{item.name}</b>? Los álbumes relacionados no se borrarán, pero se quedarán sin asignar a ningún área</p>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button type="default" onClick={() => setOpenPopover(false)}>Cancelar</Button>&nbsp;&nbsp;
                                        <Button 
                                            type="primary" 
                                            style={{ filter: "hue-rotate(150deg)" }}
                                            loading={loadingDelete}
                                            onClick={async () => {
                                                await deleteZone({ variables: { id: item.id }})
                                                setOpenPopover(false)
                                            }}
                                        >Eliminar</Button>
                                    </div>
                                </div>
                            }
                        >
                            <Tag color="volcano" style={{ cursor: "pointer" }}><DeleteOutlined /> Eliminar</Tag>
                        </Popover>
                        <Modal
                            title="Crear una nueva área"
                            visible={createZoneModal}
                            onCancel={() => setCreateZoneModal(false)}
                            onOk={async () => {
                                await createZone({ variables: { name: zoneName }})
                                setCreateZoneModal(false)
                            }}
                            okText="Crear"
                            confirmLoading={loadingCreate}
                        >
                            <label htmlFor="name">Nombre</label>
                            <Input name="name" value={zoneName} onChange={evt => setZoneName(evt.target.value)} />
                        </Modal>
                    </div>
                )
            }
        }
    ]
    return (
        <BodyWrapper>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Lista de áreas</h1>
                <Button onClick={() => setCreateZoneModal(true)}><PlusOutlined /> Nueva área</Button>
            </div>
            <Table loading={loading} dataSource={data?.zones || []} columns={columns} rowKey="id" />
        </BodyWrapper>
    )
}


export default Areas