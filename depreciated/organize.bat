@echo off
echo Creating project structure...

:: Create directories if they don't exist
if not exist "src" mkdir src
if not exist "dist" mkdir dist

:: Move source files to src directory
echo Moving source files to src directory...
move /Y main.js src\
move /Y styles.css src\
move /Y index.html src\

:: Copy files to dist directory for use
echo Copying files to dist directory...
xcopy /Y /S src\*.* dist\

echo.
echo Project organized into:
echo - src/: Source files for development
echo - dist/: Files for production use
echo.
pause 