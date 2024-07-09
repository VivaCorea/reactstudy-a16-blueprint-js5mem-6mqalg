import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { alreadyList, likeList, wantList } from "../atom";
import { useForm } from "react-hook-form";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 600px;
  margin: 0 auto;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: auto;
  text-align: center;
`;

const CountryList = styled.ol`
  counter-reset: li;
  padding: 0;
  width: 500px;
`;
const Country = styled.li`
  list-style: none;
  position: relative;
  margin: 0 0 10px 2em;
  padding: 6px 0px;
  background: rgba(221, 122, 129, 0.1);
  color: ${(props) => props.theme.accentColor};
  &:before {
    content: counter(li);
    counter-increment: li;
    position: absolute;
    top: -16px;
    left: -30px;
    box-sizing: border-box;
    width: 2em;
    margin-right: 8px;
    color: ${(props) => props.theme.btnColor};
    font-weight: bold;
    font-size: 30px;
  }
`;

const RequiredAlert = styled.span`
  color: red;
`;
function MyCountries() {
  /* useEffect(() => {
    _reset();
  }, []); */
  const setWantList = useSetRecoilState(wantList);
  const setAlreadyList = useSetRecoilState(alreadyList);
  const setLikeList = useSetRecoilState(likeList);

  const wantItems = useRecoilValue(wantList);
  const alreadyItems = useRecoilValue(alreadyList);
  const likeItems = useRecoilValue(likeList);

  const getExistData = (key, item) => {
    const localStorageItem = localStorage.getItem(key);
    return localStorageItem !== null &&
      localStorageItem !== undefined &&
      localStorageItem !== ""
      ? JSON.parse(localStorageItem)
      : [];
  };

  const addItem = (key, item) => {
    let existData = getExistData(key, item);
    const isExist = existData.find((exist) => exist === item);
    if (isExist) {
      return existData;
    } else {
      existData = [...existData, item];
      localStorage.setItem(key, JSON.stringify(existData));
      return existData;
    }
  };

  const removeItem = (key, item) => {
    let existData = getExistData(key, item);
    const index = existData.indexOf(item);
    if (index > -1) {
      existData.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(existData));
      return existData;
    }
  };

  const onMove = (item, from, to) => {
    if (from === "want") {
      setWantList(removeItem(from, item));
      if (wantItems.length < 1) {
        _reset();
      }
    }
    if (to === "want") {
      setWantList(addItem(to, item));
    }
    if (from === "already") {
      setAlreadyList(removeItem(from, item));
    }
    if (to === "already") {
      setAlreadyList(addItem(to, item));
    }
    if (from === "like") {
      setLikeList(removeItem(from, item));
    }
    if (to === "like") {
      setLikeList(addItem(to, item));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();
  const onValid = (data) => {
    const item = data.name;
    if (item === "") {
      setError("name", { message: "😡required!" });
    } else if (
      wantItems.indexOf(item) < 0 &&
      alreadyItems.indexOf(item) < 0 &&
      likeItems.indexOf(item) < 0
    ) {
      onMove(item, null, "want");
      setValue("name", "");
    }
  };
  const _reset = () => {
    setWantList([]);
    setAlreadyList([]);
    setLikeList([]);
    localStorage.clear();
    setValue("name", "");
  };
  console.log(errors);
  return (
    <Container>
      <FormContainer>
        <Title>내가 가고싶은 나라들({wantItems.length})</Title>
        {wantItems.length > 0 ||
        alreadyItems.length > 0 ||
        likeItems.length > 0 ? (
          <button onClick={() => _reset()}>🔄️Reset</button>
        ) : null}
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit(onValid)}
        >
          <input {...register("name")} placeholder="이름" />
          <RequiredAlert>{errors.name?.message}</RequiredAlert>
          <button>GoGo!</button>
        </form>
        <CountryList>
          {wantItems.map((want) => (
            <Country key={want}>
              {want}
              <button onClick={() => onMove(want, "want", "already")}>
                ✅
              </button>
              <button onClick={() => onMove(want, "want", null)}>🪣</button>
            </Country>
          ))}
        </CountryList>
        <Title>내가 가본 나라들({alreadyItems.length})</Title>
        <CountryList>
          {alreadyItems.map((already) => (
            <Country key={already}>
              {already}
              <button onClick={() => onMove(already, "already", "like")}>
                👍
              </button>
              <button onClick={() => onMove(already, "already", "want")}>
                ❌
              </button>
            </Country>
          ))}
        </CountryList>
        <Title>내가 좋아하는 나라들({likeItems.length})</Title>
        <CountryList>
          {likeItems.map((like) => (
            <Country key={like}>
              {like}
              <button onClick={() => onMove(like, "like", "already")}>
                👎
              </button>
            </Country>
          ))}
        </CountryList>
      </FormContainer>
    </Container>
  );
}

export default MyCountries;
