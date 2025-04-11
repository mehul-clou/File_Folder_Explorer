import { useState } from "react";
import "./styles.css";
import json from "./data.json";

const List = ({ list, addNodeToList, deleteNodeFromList }) => {
  const [isExpanded, setIsExpanded] = useState({});

  return (
    <div className="container">
      {list.map((node) => {
        return (
          <div key={node.id}>
            {node?.isFolder && (
              <span
                onClick={() =>
                  setIsExpanded((prev) => ({
                    ...prev,
                    [node.name]: !prev[node.name],
                  }))
                }
              >
                {isExpanded?.[node.name] ? "-" : "+"}
              </span>
            )}

            <span>{node.name}</span>

            {node.isFolder && (
              <span>
                <img
                  className="icon"
                  src="https://play-lh.googleusercontent.com/aaZooxSV5sr6CRIENPsaryg2pFFqCvQN_ogceMEeW-bDricpAee1qixkM4Oyf5Bvtw=w240-h480-rw"
                  alt="icon"
                  onClick={() => addNodeToList(node.id)}
                />
              </span>
            )}

            {node && (
              <span>
                <img
                  alt="delete"
                  className="icon"
                  src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                  onClick={() => deleteNodeFromList(node.id)}
                />
              </span>
            )}

            {isExpanded?.[node.name] && node?.children && (
              <List
                list={node.children}
                addNodeToList={addNodeToList}
                deleteNodeFromList={deleteNodeFromList}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState(json);

  const addNodeToList = (parentId) => {
    const name = prompt("enter the name");
    const updateTree = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              { id: Date.now(), name: name, isFolder: true, children: [] },
            ],
          };
        }

        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setData((prev) => updateTree(prev));
  };

  const deleteNodeFromList = (itemId) => {
    const updateTree = (list) => {
      return list
        .filter((node) => node.id !== itemId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });
    };
    setData((prev) => updateTree(prev));
  };

  return (
    <div className="App">
      <h1>File/Folder Explorer</h1>
      <List
        list={data}
        addNodeToList={addNodeToList}
        deleteNodeFromList={deleteNodeFromList}
      />
    </div>
  );
}
