import { gql } from '@apollo/client'

export const GET_ZONES = gql`
    query GetZones {
        zones{
            id
            name
            thumb{
                url
            }
            albums{
                id
            }
            subzones{
                id
                name
                albums{
                    id
                }
            }
        }
    }
`

export const GET_ALBUMS = gql`
    query GetAlbums {
        albums {
            id
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
`

export const GET_GENRES = gql`
    query GetGenres {
        genres {
            id
            name
        }
    }
`

export const GET_GENRE_POPULATED = gql`
    query GetGenrePopulated($id: ID!) {
        genre(id: $id){
            id
            name
            albums {
                id
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
