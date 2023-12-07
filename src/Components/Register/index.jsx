import { useState } from "react";
import { Link } from "react-router-dom"; // 추가
import styled from 'styled-components';


// 스타일이 적용된 입력 필드 컴포넌트
const StyledInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px; // 각 요소 사이에 여유 공간을 추가
  box-sizing: border-box; // padding과 border가 width에 포함되도록 설정
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// 스타일이 적용된 버튼 컴포넌트
const StyledButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px; // 버튼 아래에 여유 공간을 추가
  background-color: #5c6bc0; // 버튼 색상 설정
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3f51b5;
  }
`;

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #5c6bc0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// 폼 컨테이너 스타일링
const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
`;


const Register = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 유효성 검사 수행
    // 인증 서버에 POST 요청 보내기
    // 응답 처리하기

    if (!id) {
      return alert("ID를 입력하세요.");
    }
    else if (!password) {
      return alert("Password를 입력하세요.");
    }


    console.log('Email', id);
    console.log('Password', password);
    
    let body = {
        id,
        password
    }
  };

  return (
    <FormContainer>
      <StyledInput
        type="text"
        id="username"
        placeholder="사용자 이름"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <StyledInput
        type="password"
        id="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <StyledButton onClick={handleSubmit}>회원가입</StyledButton>
      <StyledLink to="/">뒤로가기</StyledLink>
    </FormContainer>
  );
};

export default Register;