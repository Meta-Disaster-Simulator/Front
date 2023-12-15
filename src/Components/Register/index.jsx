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
  opacity: ${props => props.disabled ? 0.5 : 1};  // 버튼 비활성화 시 투명도 적용
  cursor: ${props => props.disabled ? 'default' : 'pointer'};  // 버튼 비활성화 시 커서 변경
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

// 제목을 위한 스타일드 컴포넌트
const Title = styled.h1`
  font-size: 2rem; /* 글자 크기 조정 */
  color: #333; /* 글자 색상 수정 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 글꼴 가족 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-weight: bold; /* 글자 두께 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 텍스트에 그림자 효과 추가 */
  margin: 0 0 1.5rem 0; /* 제목 아래에만 마진을 줘서 폼과 간격을 둠 */
`;

// 소제목을 위한 스타일드 컴포넌트
const Subtitle = styled.h2`
  font-size: 1.25rem; /* 글자 크기 조정 */
  color: #555; /* 글자 색상 약간 어둡게 조정 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 글꼴 가족 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-weight: normal; /* 글자 두께 */
  margin: 0 0 2rem 0; /* 소제목 아래에 마진을 더 줘서 폼과 간격을 둠 */
  letter-spacing: 0.5px; /* 글자 사이 간격 조정 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 텍스트에 그림자 효과 추가 */
`;


// 전체 페이지를 감싸는 컨테이너에 배경 이미지 추가
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-image: url('image/back5.png'); /* 배경 이미지 경로 설정 */
  background-size: cover; /* 이미지가 전체 배경을 커버하도록 설정 */
  background-position: center; /* 이미지가 중앙에 오도록 설정 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 설정 */
`;

// 폼 컨테이너 스타일링 수정
const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: #f0f0f0; /* 하얀 배경을 연한 회색으로 변경 */
  margin: 1rem auto; /* 상단 여백 추가 */
  padding: 2rem;
  background: #f0f0f0; /* 하얀 배경을 연한 회색으로 변경 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  position: relative; /* 타이틀을 포지셔닝하기 위해 relative 설정 */
`;

const LogoContainer = styled.div`
  background-image: url('image/안전모.png'); // 로고 이미지 경로 설정
  background-size: contain; // 이미지가 컨테이너 내에 맞도록 조정
  background-position: center center; // 이미지 위치를 중앙으로 설정
  background-repeat: no-repeat; // 이미지가 반복되지 않도록 설정
  width: 100px; // 로고 크기를 줄임
  height: 100px; // 로고 크기를 줄임
  margin: 20px auto; // 상단과 하단 여백을 줌, 로고를 수평 중앙 정렬
`;


const Register = () => {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value);
  }
  const onNameHandler = (event) => {
      setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
  }
  const onConfirmPasswordHandler = (event) => {
      setConfirmPassword(event.currentTarget.value);
  }
  return (
    <PageContainer>
        <FormContainer>
            <LogoContainer />
            <Title>회원가입</Title>
            <StyledInput
                type='email'
                value={Email}
                onChange={onEmailHandler}
                placeholder="이메일"
            />
            <StyledInput
                type='text'
                value={Name}
                onChange={onNameHandler}
                placeholder="이름"
            />
            <StyledInput
                type='password'
                value={Password}
                onChange={onPasswordHandler}
                placeholder="비밀번호"
            />
            <StyledInput
                type='password'
                value={ConfirmPassword}
                onChange={onConfirmPasswordHandler}
                placeholder="비밀번호 확인"
            />
            <StyledButton formAction=''>
                회원가입
            </StyledButton>
        </FormContainer>
    </PageContainer>
);
}


export default Register;