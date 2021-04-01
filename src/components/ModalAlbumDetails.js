import React from 'react'
import {
    Modal,
    Descriptions
} from 'antd'

const ModalAlbumDetails = () => {
    return (
        <Modal
            width="80%"
            visible={detailModal?.show}
            onCancel={() => setDetailModal({ show: false })}
            cancelText="Cerrar"
            okText="Añadir"
            onOk={() => handleAdd(detailData)}
            confirmLoading={loadingCreate}
        >
            { loadingDetails ? <Spin /> : (
                <Descriptions
                    labelStyle={{ fontWeight: "bold "}}
                    bordered="true"
                    column={1}
                    title={<div>
                        <Thumb src={detailData?.thumb || process.env.REACT_APP_ALBUM_PLACEHOLDER} />
                        <span style={{ marginLeft: "1em" }}>{ detailData?.title }</span>
                    </div>}
                >
                    <Descriptions.Item label="Lanzamiento">{ detailData?.released }</Descriptions.Item>
                    <Descriptions.Item label="Artistas">{ (detailData?.artists || []).reduce((acc, it) => acc + ", " + it.name, "").slice(2) }</Descriptions.Item>
                    {(detailData?.extraartists || []).length > 0 && (
                        <Descriptions.Item label="Otros artistas">{ detailData?.extraartists.reduce((acc, it) => acc + ", " + it.name, "").slice(2) }</Descriptions.Item>
                    )}
                    <Descriptions.Item label="Lista de canciones">
                        <ul style={{ padding: 0 }}>
                            { (detailData?.tracklist || []).map(track => <li style={{ listStyle: "none" }}>{track.position && (track.position + " - ")}{ track?.title }</li>) }
                        </ul>
                    </Descriptions.Item>
                    {(detailData?.videos || []).filter(v => v.embed).length > 0 && (
                        <Descriptions.Item label="Vídeos">
                            <ul style={{ padding: 0 }}>
                                {(detailData?.videos || []).filter(v => v.embed).map((v, i) => (
                                    <li 
                                        key={"video-" + i}
                                        style={{ 
                                            listStyle: "none", 
                                            color: "dodgerblue", 
                                            cursor: "pointer" 
                                        }} 
                                        onClick={() => {
                                            console.log(v.uri)
                                            setVideoModal({ 
                                                show: true, 
                                                uri: (v.uri || "").replace("watch?v=", "embed/"),
                                            })
                                        }}
                                    >{v.title}</li>
                                ))}
                            </ul>
                        </Descriptions.Item>
                    )}
                    {(detailData?.images || []).length > 0 && (
                        <Descriptions.Item label="Imágenes"><Button onClick={() => setImageModal({ show: true, images: detailData?.images })}>Ver imágenes</Button></Descriptions.Item>
                    )}
                    {(detailData?.genre || []).length > 0 && (
                        <Descriptions.Item label="Género">{(detailData?.genres || []).map((gnr, i) => <Tag key={"gnr-m-" + i}>{gnr}</Tag>) }</Descriptions.Item>
                    )}
                    {(detailData?.styles || []).length > 0 && (
                        <Descriptions.Item label="Estilo">{(detailData?.styles || []).map((style, i) => <Tag key={"style-m-" + i}>{style}</Tag>) }</Descriptions.Item>
                    )}
                </Descriptions>
            )}
        </Modal>
    )
}

export default ModalAlbumDetails