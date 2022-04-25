import React, { useState, useEffect /*для колбэков*/} from "react"; 
import axios from "axios";
import styled from "styled-components"; // стили
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg"; //импорт логотипа
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // тостовый файл реагирования
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = { //объект с параметрами
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({ // начальные параметры = пустым строкам
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => { // функция изменения дескриптора, чтобы конст обрабатывала событие изменения
    setValues({ ...values, [event.target.name]: event.target.value }); // указываем контрольную точку
  };

  const handleValidation = () => { // проверка дескриптора = объекта
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error( // точка ошибки
        "Пароль не совпадают, а должны",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Имя должно быть не менее 3 символов",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Пароль должен включать не менее 8 символов",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Обязательно внесите почту, а то вдруг пароль забудите", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => { //асинхронная обработка отправки 
    event.preventDefault(); //точка события по умолчанию
    if (handleValidation()) { // в процессе валидации
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY, //пользователь нашего приложения
          JSON.stringify(data.user)//передача информации о пользователе в локальном хранилище
        );
        navigate("/");
      }
    }
  };

  return ( // контейнер формы
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}> 
          <div className="brand">
            <img src={Logo} alt="logo" />  
            <h1>push-ka</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)} 
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Создать учётку</button>
          <span>
            Всё-таки есть аккаунт? <Link to="/login">Возвращайся :)</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer /> 
    </>
  );
}//↑ контейнер тоста ошибки

//стилизация внутри контейнера
const FormContainer = styled.div` 
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient( to top left,#3f2d87,#fccece);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #19003aed;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #FF4C94;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #3F2D87;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #3F2D87;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #00FFCD;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
