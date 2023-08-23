import { EntityState, createEntityAdapter } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const assetsAdapter = createEntityAdapter<any>()

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.coincap.io/v2/" }),
  endpoints: builder => ({
    getAssets: builder.query<EntityState<any>, void>({
      query: () => "/assets",
      transformResponse: (response: any, meta) => {
        return assetsAdapter.addMany(
          assetsAdapter.getInitialState(),
          response.data
        )
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL")
        try {
          await cacheDataLoaded
          ws.addEventListener("message", (e: any) => {
            const incomingPrices = JSON.parse(e.data)

            updateCachedData(draft => {
              for (const updatedPrice in incomingPrices) {
                assetsAdapter.updateOne(
                  draft,
                  {
                    id: updatedPrice,
                    changes: {
                      priceUsd: incomingPrices[updatedPrice]
                    }
                  }
                )
              }
            })
          })
        } catch (e) {}
      }
    })
  })
})

export const { useGetAssetsQuery } = apiSlice

export { assetsAdapter }

export default apiSlice
