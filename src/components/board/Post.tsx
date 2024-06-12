import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MDEditor from '@uiw/react-md-editor';
import { options } from './options';
import { createPost } from '../../api/board/Post'; // createPost 함수 임포트

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3vh;
    width: 100%;
    height: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: flex-end;
    z-index: 1;
`;

interface ButtonProps {
    isSelected?: boolean;
}

const Button = styled.button<ButtonProps>`
    padding: 1vh 2vw;
    font-size: 2vh;
    border: none;
    background-color: ${props => props.color || "#007BFF"};
    color: white;
    cursor: pointer;
    border-radius: 1vh 1vh 0 0;
    transform: scale(${props => props.isSelected ? 1.2 : 1});
    transform-origin: bottom;
    transition: transform 0.3s ease, margin-left 0.3s ease, margin-right 0.3s ease;
    position: relative;
    z-index: ${props => props.isSelected ? 1 : 0};
    margin-left: ${props => props.isSelected ? '1vw' : '0'};
    margin-right: ${props => props.isSelected ? '1vw' : '0'};

    &:hover {
        background-color: #007BFF;
    }
`;

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 3vh;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius:  0 0 1vh 1vh;
`;

const TitleInput = styled.input`
    width: 100%;
    padding: 5vh;
    font-size: 4vh;
    border: none;
    border-radius: 0;
    outline: none;
`;

const MarkdownEditorContainer = styled.div`
    margin-top: 2vh;
    border-radius: 1vh;
    overflow: hidden;
    border: 0.1vh solid #ccc;
`;

const StyledMDEditor = styled(MDEditor)`
    border-radius: 3vh;
`;

const DropdownContainer = styled.div`
    width: 90%;
    margin-bottom: 1vh;
    padding: 1vh;
`;

const Dropdown = styled.select`
    width: 100%;
    padding: 1vh;
    font-size: 2vh;
    border: none;
    border-radius: 1vh;
    background-color: #f0f0f0;
    outline: none;
`;

const Option = styled.option``;

const SubmitButton = styled.button`
    padding: 1vh 5vw;
    font-size: 2vh;
    border: none;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
    border-radius: 1vh;
    margin-top: 3vh;
    align-self: flex-end;
    font-weight: bold;
`;

const Post: React.FC = () => {
    const [value, setValue] = useState<string | undefined>("");
    const [selectedButton, setSelectedButton] = useState<string | null>('teamProject');
    const [selectedCategory, setSelectedCategory] = useState<string | null>('teamProject');
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (selectedCategory !== null && options[selectedCategory]) {
            setCategoryOptions(options[selectedCategory]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        setSelectedCategory('teamProject'); // 페이지 로드 시 '팀프로젝트'를 선택
    }, []);

    const handleButtonClick = (category: string | null) => {
        setSelectedButton(category);
        // 선택한 카테고리에 맞는 기본 값 설정
        if (category === 'teamProject') {
            setSelectedCategory('App(모바일 애플리케이션)');
        } else if (category === 'developer') {
            setSelectedCategory('App(모바일 애플리케이션)');
        } else if (category === 'designer') {
            setSelectedCategory('UI/UX 디자인');
        } else {
            setSelectedCategory(category);
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleSubmission = async () => {
        const category = selectedButton === 'teamProject' ? '팀프로젝트' :
            selectedButton === 'developer' ? '개발자' :
                selectedButton === 'designer' ? '디자이너' : '';

        const postData = {
            title,
            content: value || "", // undefined일 경우 빈 문자열로 대체
            user: { id: 1 },
            category: category,
            field: selectedCategory,
        };

        console.log("Request data:", postData);
        console.log("|||||||   끝났다");
        try {
            const response = await createPost(postData);
            console.log("Post created successfully:", response);
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    return (
        <PageContainer>
            <ButtonContainer>
                <Button color="#AAD8FF" isSelected={selectedButton === 'teamProject'} onClick={() => handleButtonClick('teamProject')}>팀프로젝트</Button>
                <Button color="#77B5FE" isSelected={selectedButton === 'developer'} onClick={() => handleButtonClick('developer')}>개발자</Button>
                <Button color="#6CACE4" isSelected={selectedButton === 'designer'} onClick={() => handleButtonClick('designer')}>디자이너</Button>
                <Button color="#4682B4" isSelected={selectedButton === null} onClick={() => handleButtonClick(null)}>스터디</Button>
            </ButtonContainer>
            <PostContainer>
                <TitleInput
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {selectedCategory !== null && categoryOptions.length > 0 && (
                    <DropdownContainer>
                        <Dropdown onChange={handleCategoryChange} value={selectedCategory}>
                            <Option value="" disabled>분야를 선택하세요</Option>
                            {categoryOptions.map((option: string, index: number) => (
                                <Option key={index} value={option}>{option}</Option>
                            ))}
                        </Dropdown>
                    </DropdownContainer>
                )}
                <MarkdownEditorContainer>
                    <StyledMDEditor
                        value={value}
                        onChange={setValue}
                        height={40 * document.documentElement.clientHeight / 100}
                    />
                </MarkdownEditorContainer>
                <SubmitButton onClick={handleSubmission}>등록</SubmitButton>
            </PostContainer>
        </PageContainer>
    );
};

export default Post;