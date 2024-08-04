"use client";
import { db } from "./firebase";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

export default function Home() {
  const [data, setData] = useState([]);
  const [addName, setAddName] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [edit, setEdit] = useState({ b: false, idx: 0 });
  const [entry, setEntry] = useState({});
  const [searchP, setSearch] = useState("");
  function updateData() {
    let arr = [];
    getDocs(collection(db, "items"))
      .then((qss) => {
        qss.forEach((e) => {
          if(searchP !== "" && e.data().name.includes(searchP)){
            arr.push({ id: e.id, data: e.data() });
          } else if(searchP == "") {
            arr.push({ id: e.id, data: e.data() });
          }
        });
        setData(arr);
      })
      .catch((err) => console.error(err));
  }
  const txtsx = {
    margin: "3px",
    width: "30%",
  };
  useEffect(updateData);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center text-center justify-center">
        <div className="w-full flex flex-col mb-8">
          <h2 className="text-2xl font-semibold">The Pantry</h2>
          <div className="items-center justify-center">
            <TextField
              sx={txtsx}
              id="search"
              value={searchP}
              autoComplete="off"
              label="Search"
              variant="outlined"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row text-center">
            <p className="m-2 w-[50%] font-semibold">Item Name</p>
            <p className="m-2 w-[50%] font-semibold">Item Quantity</p>
          </div>
          {data.map((e, idx) => {
            return !edit.b || idx != edit.idx ? (
              <div key={`idx${idx}`} className="flex flex-row text-center">
                <div className="m-2 w-[50%] flex flex-row">
                  <ModeEditIcon
                    onClick={() => {
                      setEdit({ b: true, idx });
                      setEntry(e.data);
                    }}
                  />
                  <DeleteIcon
                    onClick={() => {
                      deleteDoc(doc(db, "items", e.id))
                        .then(() => {
                          updateData();
                        })
                        .catch((err) => console.error(err));
                    }}
                  />
                  <p className="px-8">{e.data.name}</p>
                </div>
                <p className="m-2 w-[50%]">{e.data.quantity}</p>
              </div>
            ) : (
              <div key={`idx${idx}`} className="flex flex-row text-center">
                <CheckIcon
                  onClick={() => {
                    setDoc(doc(db, "items", e.id), entry)
                      .then(() => {
                        updateData();
                        setEdit(false);
                      })
                      .catch((err) => console.error(err));
                  }}
                />
                <ClearIcon onClick={() => setEdit(false)} />
                <TextField
                  sx={txtsx}
                  id="editname"
                  value={entry.name}
                  autoComplete="off"
                  label="Name"
                  variant="outlined"
                  onChange={(e) => {
                    setEntry({ ...entry, name: e.target.value });
                  }}
                />
                <TextField
                  sx={txtsx}
                  id="editquantity"
                  value={entry.quantity}
                  autoComplete="off"
                  label="Quantity"
                  variant="outlined"
                  onChange={(e) => {
                    setEntry({ ...entry, quantity: e.target.value });
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-row">
          {!edit.b ? (
            <>
              <TextField
                sx={txtsx}
                value={addName}
                id="name"
                autoComplete="off"
                label="Item Name"
                variant="outlined"
                onChange={(e) => {
                  setAddName(e.target.value);
                }}
              />
              <TextField
                sx={txtsx}
                value={addQuantity}
                id="quantity"
                label="Quantity"
                autoComplete="off"
                variant="outlined"
                onChange={(e) => {
                  try {
                    console.log(Number(e.target.value));
                    setAddQuantity(
                      isNaN(Number(e.target.value))
                        ? ""
                        : Number(e.target.value)
                    );
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
              <Button
                sx={{
                  width: "30%",
                  height: "3rem",
                  marginX: "8px",
                  marginY: "8px",
                }}
                variant="contained"
                onClick={() => {
                  addDoc(collection(db, "items"), {
                    name: addName,
                    quantity: addQuantity,
                  })
                    .then(() => {
                      setAddName("");
                      setAddQuantity("");
                      updateData();
                    })
                    .catch((err) => console.error(err));
                }}
              >
                Add Item
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}
