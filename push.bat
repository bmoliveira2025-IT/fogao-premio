@echo off
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

echo Adicionando arquivos...
%GIT_PATH% add .

if "%~1"=="" (
    echo Commitando com mensagem padrao...
    %GIT_PATH% commit -m "update"
) else (
    echo Commitando com mensagem: %~1
    %GIT_PATH% commit -m "%~1"
)

echo Enviando para o repositorio...
%GIT_PATH% push

echo.
echo ==========================================
echo SUCESSO! Alteracoes enviadas para o Git.
echo ==========================================
pause
