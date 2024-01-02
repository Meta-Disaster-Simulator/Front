import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [ unityNickName, setunityNickName ] = useState(""); // 유니티 사용자 닉네임
    const [ unityScore, setunityScore ] = useState(""); // 유니티 사용자 점수

    return (
        <UserContext.Provider value={{ userId, setUserId, unityNickName, setunityNickName, unityScore, setunityScore }}>
            {children}
        </UserContext.Provider>
    );
};