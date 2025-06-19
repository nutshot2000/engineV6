import React from "react";

function AssetManager({ assets, setAssets }) {
  return (
    <div className="asset-grid">
      {assets.map((asset, i) => (
        <div key={asset.name + i} className="asset-item">
          <img
            src={asset.src}
            alt={asset.name}
            className="asset-preview"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("asset", JSON.stringify(asset));
            }}
          />
          <div className="asset-name">{asset.name.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '')}</div>
        </div>
      ))}
    </div>
  );
}

export default AssetManager;
