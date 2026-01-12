<template>
    <div class="text-center mb-16">
        <h1 class="text-5xl font-extrabold tracking-tight mb-4">
            Leaderboard
        </h1>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UTable :data="data" :columns="columns" class="flex-1" />
    </div>
</template>

<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui';
    import type { TableMeta, Row } from '@tanstack/vue-table'

    type Player = {
        id: string
        playerName: string
        playedMatch: string
        winner: string
        loose: string
        points: number
    }

    const data = ref<Player[]>([
        {
            id: '1',
            playerName: 'Nicolas',
            playedMatch: '10',
            winner: '5',
            loose: '5',
            points: 5,
        },
        {
            id: '1',
            playerName: 'Marc',
            playedMatch: '10',
            winner: '5',
            loose: '5',
            points: 5,
        },
        {
            id: '1',
            playerName: 'Jean',
            playedMatch: '10',
            winner: '5',
            loose: '5',
            points: 5,
        },
        {
            id: '1',
            playerName: 'Benoit',
            playedMatch: '10',
            winner: '5',
            loose: '5',
            points: 5,
        },
    ])

    const columns: TableColumn<Player>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            }
        },
        {
            accessorKey: 'playerName',
            header: 'Nom du joueur',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            }
        },        
        {
            accessorKey: 'playedMatch',
            header: 'Nombre de match joués',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            }
        },        
        {
            accessorKey: 'winner',
            header: 'Victoire',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            }
        },        
        {
            accessorKey: 'loose',
            header: 'Défaite',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            }
        },        
        {
            accessorKey: 'points',
            header: 'Points',
            meta: {
                class: {
                    th: 'text-center font-semibold',
                    td: 'text-center font-mono'
                }
            },
        },
    ]
</script>