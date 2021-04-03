import { gql } from '@apollo/client'

export const CREATE_ZONE = gql`
    mutation CreateZone(
        $name: String!
    ){
        createZone(
            input: {
                data: {
                    name: $name
                }
            }
        ){
            zone {
                id
                name
            }
        }
    }
`

export const UPDATE_ZONE = gql`
    mutation UpdateZone(
        $id: ID!
        $name: String!
    ){
        updateZone(
            input: {
                where: { id: $id }
                data: {
                    name: $name
                }
            }
        ){
            zone {
                id
                name
            }
        }
    }
`

export const DELETE_ZONE = gql`
    mutation DeleteZone(
        $id: ID!
    ){
        deleteZone(
            input: {
                where: { id: $id }
            }
        ){
            zone {
                id
                name
            }
        }
    }
`

export const CREATE_SUBZONE = gql`
    mutation CreateSubzone(
        $name: String!
        $zone: ID!
    ){
        createSubzone(
            input: {
                data: {
                    name: $name
                    zone: $zone
                }
            }
        ){
            subzone {
                id
                name
                zone {
                    id
                }
            }
        }
    }
`

export const UPDATE_SUBZONE = gql`
    mutation UpdateSubzone(
        $id: ID!
        $name: String!
    ){
        updateSubzone(
            input: {
                where: { id: $id }
                data: {
                    name: $name
                }
            }
        ){
            subzone {
                id
                name
            }
        }
    }
`

export const DELETE_SUBZONE = gql`
    mutation DeleteSubzone(
        $id: ID!
    ){
        deleteSubzone(
            input: {
                where: { id: $id }
            }
        ){
            subzone {
                id
                name
            }
        }
    }
`

export const CREATE_ALBUM = gql`
    mutation CreateAlbum(
        $title: String!
        $zone: ID
        $artists_sort: String!
        $full_artist_list: JSON
        $album_format: String
        $extraartists: JSON
        $genres: JSON
        $images: JSON
        $labels: JSON
        $master_url: String
        $notes: String
        $release: Int
        $resource_url: String
        $styles: JSON
        $thumb: String
        $tracklist: JSON
        $uri: String
        $year: Int
    ){
        createAlbum(
            input: {
                data: {
                    title: $title,
                    zone: $zone,
                    artists_sort: $artists_sort,
                    full_artist_list: $full_artist_list,
                    album_format: $album_format,
                    extraartists: $extraartists,
                    genres: $genres,
                    images: $images,
                    labels: $labels,
                    master_url: $master_url,
                    notes: $notes,
                    release: $release,
                    resource_url: $resource_url,
                    styles: $styles,
                    thumb: $thumb,
                    tracklist: $tracklist,
                    uri: $uri,
                    year: $year,
                }
            }
        ){
        album {
                title
                zone { 
                    id 
                    name
                }
                artists_sort
                full_artist_list
                album_format
                extraartists
                genres
                images
                labels
                master_url
                notes
                release
                resource_url
                styles
                thumb
                tracklist
                uri
                year
            }
        }
    }
`

export const UPDATE_ALBUM = gql`
    mutation UpdateAlbum(
        $id: ID!
        $title: String!
    ){
        updateZone(
            input: {
                where: { id: $id }
                data: {
                    title: $title
                }
            }
        ){
            album {
                id
                title
            }
        }
    }
`

export const DELETE_ALBUM = gql`
    mutation DeleteAlbum(
        $id: ID!
    ){
        deleteAlbum(
            input: {
                where: { id: $id }
            }
        ){
            album {
                id
                title
            }
        }
    }
`