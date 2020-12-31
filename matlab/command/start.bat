ECHO off

REM Aller au repertoire parent pour que Matlab demarre dedans
cd ..

REM Retirer fichier stop s'il existe
erase "stop.command"

REM Start CNN pour analyse image
ECHO Demarrage de Matlab
matlab -batch "classifyRunner"