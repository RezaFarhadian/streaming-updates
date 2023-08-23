import React from 'react';
import './App.css';
import { assetsAdapter, useGetAssetsQuery } from './redux/features/api/apiSlice';

function App() {
  const {
    data
  } = useGetAssetsQuery()

  let assets
  if (data) {
    assets = assetsAdapter
      .getSelectors()
      .selectAll(data)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2
          className="App-link"
        >
          Below prices will fetch first then stream them own updates via WebSocket
        </h2>
        {
          assets?.map((asset: any) =>
            <h6 key={asset.id}>{asset.name}: {asset.priceUsd}</h6>
          )
        }
      </header>
    </div>
  );
}

export default App;
