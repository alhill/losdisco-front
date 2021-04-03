import React, { useState, useRef } from 'react'
import { BodyWrapper } from '../library'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ZONES } from '../graphql/queries'
import { CREATE_ZONE, UPDATE_ZONE, DELETE_ZONE, 
         CREATE_SUBZONE, UPDATE_SUBZONE, DELETE_SUBZONE 
} from '../graphql/mutations'
import { Table, Tag, Button, Modal, Popover, Input, message } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SelectOutlined } from '@ant-design/icons'
import _ from 'lodash'

const Areas = () => {
    const { loading, data, refetch } = useQuery(GET_ZONES, { fetchPolicy: "no-cache" })
    const [zoneName, setZoneName] = useState("")
    const [openPopover, setOpenPopover] = useState()
    const [openSubPopover, setOpenSubPopover] = useState()
    const [createZoneModal, setCreateZoneModal] = useState({ show: false })
    const [selectedZone, setSelectedZone] = useState()

    const [createZone, { loading: loadingCreate }] = useMutation(CREATE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [updateZone, { loading: loadingUpdate }] = useMutation(UPDATE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [deleteZone, { loading: loadingDelete }] = useMutation(DELETE_ZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [createSubZone, { loading: loadingCreateSub }] = useMutation(CREATE_SUBZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [updateSubZone, { loading: loadingUpdateSub }] = useMutation(UPDATE_SUBZONE, { refetchQueries: [{ query: GET_ZONES }] })
    const [deleteSubZone, { loading: loadingDeleteSub }] = useMutation(DELETE_SUBZONE, { refetchQueries: [{ query: GET_ZONES }] })
 
    const columns = type => {
        return [
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
                            { type === "zone" && (
                                <Tag 
                                    color="geekblue" 
                                    style={{ 
                                        cursor: "pointer",
                                        filter: item.id === selectedZone ? "saturate(10)" : "saturate(1)"
                                    }}
                                    onClick={() => setSelectedZone(selectedZone !== item.id ? item.id : null)}
                                ><SelectOutlined /> {item.id === selectedZone ? "Seleccionada" : "Seleccionar"}</Tag>
                            )}
                            <Popover 
                                trigger="click" 
                                visible={(type === "zone" && openPopover === "edit"+item.id) || (type === "subzone" && openSubPopover === "edit"+item.id)} 
                                onClick={() => setZoneName(item.name)} 
                                onVisibleChange={bool => {
                                    if(type === "zone"){
                                        setOpenPopover(bool && "edit"+item.id)
                                    } else {
                                        setOpenSubPopover(bool && "edit"+item.id)
                                    }
                                }}
                                content={
                                    <div>
                                        Nuevo nombre
                                        <Input value={zoneName} onChange={evt => setZoneName(evt.target.value)}/>
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
                                            <Button 
                                                type="default" 
                                                onClick={() => {
                                                    setOpenPopover(false)
                                                    setOpenSubPopover(false)
                                                    setZoneName("")
                                                }}
                                            >Cancelar</Button>&nbsp;&nbsp;
                                            <Button 
                                                type="primary" 
                                                loading={loadingUpdate || loadingUpdateSub}
                                                onClick={async () => {
                                                    try{
                                                        if(type === "zone"){
                                                            await updateZone({ variables: {
                                                                id: item.id,
                                                                name: zoneName
                                                            }})
                                                        } else {
                                                            await updateSubZone({ variables: {
                                                                id: item.id,
                                                                name: zoneName
                                                            }})
                                                        }
                                                        message.success(`Se ha editado el ${type === "zone" ? "área" : "subárea"} correctamente`)
                                                        refetch()
                                                        setZoneName("")
                                                        setOpenPopover(false)
                                                        setOpenSubPopover(false)
                                                    } catch(err) {
                                                        console.log(err)
                                                        message.error(`Ocurrió un error durante el borrado del ${type === "zone" ? "área" : "subárea"}`)
                                                    }
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
                                visible={(type === "zone" && openPopover === "delete"+item.id) || (type === "subzone" && openSubPopover === "delete"+item.id)} 
                                onVisibleChange={bool => (type === "zone" && setOpenPopover(bool && "delete"+item.id)) || (type === "subzone" && setOpenSubPopover(bool && "delete"+item.id))}
                                placement="left" 
                                content={
                                    <div>
                                        <p>¿Estás seguro de que deseas eliminar el {type === "zone" ? "área" : "subárea"} <b>{item.name}</b>? Los álbumes relacionados no se borrarán, pero se quedarán sin asignar a ningún ${type === "zone" ? "área" : "subárea"}</p>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <Button type="default" onClick={() => setOpenPopover(false)}>Cancelar</Button>&nbsp;&nbsp;
                                            <Button 
                                                type="primary" 
                                                style={{ filter: "hue-rotate(150deg)" }}
                                                loading={loadingDelete || loadingDeleteSub}
                                                onClick={async () => {
                                                    try{
                                                        if(type === "zone"){
                                                            await deleteZone({ variables: { id: item.id }})
                                                        } else {
                                                            await deleteSubZone({ variables: { id: item.id }})
                                                        }
                                                        setOpenPopover(false)
                                                        setOpenSubPopover(false)
                                                        refetch()
                                                        message.success(`Se ha borrado el ${type === "zone" ? "área" : "subárea"} correctamente`)
                                                    } catch(err) {
                                                        message.error(`Ocurrió un error durante el borrado del ${type === "zone" ? "área" : "subárea"}`)
                                                    }
                                                    setOpenPopover(false)
                                                }}
                                            >Eliminar</Button>
                                        </div>
                                    </div>
                                }
                            >
                                <Tag color="volcano" style={{ cursor: "pointer" }}><DeleteOutlined /> Eliminar</Tag>
                            </Popover>
                        </div>
                    )
                }
            }
        ]
    }

    return (
        <BodyWrapper>
            <TitleAndButton>
                <h1>Lista de áreas</h1>
                <Button onClick={() => setCreateZoneModal({
                    show: true,
                    type: "área"
                })}><PlusOutlined /> Nueva área</Button>
            </TitleAndButton>
            <Table loading={loading} dataSource={data?.zones || []} columns={columns("zone")} rowKey="id" />
            { selectedZone && (
                <div style={{ marginTop: "1em" }}>
                    <TitleAndButton>
                        <h1>Subáreas de {_.get(data, "zones", []).find(z => z.id === selectedZone)?.name}</h1>
                        <Button onClick={() => setCreateZoneModal({
                            show: true,
                            type: "subárea"
                        })}><PlusOutlined /> Nueva subárea</Button>
                    </TitleAndButton>
                    <Table loading={loading} dataSource={_.get(data, "zones", []).find(z => z.id === selectedZone)?.subzones} columns={columns("subzone")} rowKey="id" />
                </div>
            )}
            <Modal
                title={`Crear una nueva ${createZoneModal?.type}${createZoneModal?.type === "subárea" ? ` en ${_.get(data, "zones", []).find(z => z.id === selectedZone)?.name}`: ""}`}
                visible={createZoneModal?.show}
                onCancel={() => setCreateZoneModal({ show: false })}
                onOk={async () => {
                    try{
                        if(createZoneModal?.type === "área"){
                            console.log("a")
                            await createZone({ variables: { name: zoneName }})
                        } else if(createZoneModal?.type === "subárea") {
                            console.log("b")
                            await createSubZone({ variables: { name: zoneName, zone: selectedZone }})
                        }
                        message.success(`${_.capitalize(createZoneModal?.type || "")} creada correctamente`)
                        setZoneName("")
                        setCreateZoneModal({ show: false })
                        refetch()
                    } catch(err) {
                        console.log(err)
                        message.error(`Ocurrió un error en la creación de un ${createZoneModal?.type}`)
                    }
                }}
                okText="Crear"
                confirmLoading={loadingCreate || loadingCreateSub}
            >
                <label htmlFor="name">Nombre</label>
                <Input name="name" value={zoneName} onChange={evt => setZoneName(evt.target.value)} />
            </Modal>
        </BodyWrapper>
    )
}

const TitleAndButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    h1{
        margin: 0;
    }
`


export default Areas