import { useState } from "react"
import keyboardCreator from "../utils/keyboard-creator"
import Keyboard from "./Keyboard"
import createDisplayedWord from "../utils/create-displayed-word"
import { checkLose, checkWin } from "../utils/check"
import DisplayedWord from "./DisplayedWord"
import HangmanImage from "./HangmanImage"

export default function Game (props) {
    let secretWord = "cats"
    let displayedWord = createDisplayedWord(secretWord, [])
    let hint = "Ameer loves"
    let keybord = keyboardCreator()
    
    let [gameState, setGameState] = useState(
        {
            secretWord: secretWord,
            displayedWord: displayedWord,
            openedLetters: [],
            hint: hint,
            keybord: keybord,
            attempts: 9
        }
    )
    const clickLetter = (pickedLetter) => {
        if (gameState.keybord[gameState.keybord.findIndex(lett => lett.key === pickedLetter)].keyStatus != "notPressed"){
            return
        }
        let newGameState = {...gameState}
        if (newGameState.secretWord.search(pickedLetter) !== -1) {
            newGameState.openedLetters.push(pickedLetter)
            newGameState.keybord[newGameState.keybord.findIndex((key) => key.key === pickedLetter)]
                .keyStatus = "rightLetter"
            newGameState.displayedWord = createDisplayedWord(newGameState.secretWord, newGameState.openedLetters)
        }
        else {
            newGameState.keybord[newGameState.keybord.findIndex((key) => key.key === pickedLetter)]
                .keyStatus = "notRightLetter"
            newGameState.attempts -= 1
        }
        if (checkWin(newGameState.displayedWord)) {
            props.gameWon()
        }
        if (checkLose(newGameState.attempts)) {
            props.gameLose()
        }
        setGameState(newGameState)
    }
    
    return (
        <div className="game-page">
            <div className="game-name">Hangman</div>
            <DisplayedWord displayedWord={gameState.displayedWord} hint={gameState.hint} />
            <Keyboard keyboard={gameState.keybord} onClickEvent={clickLetter}/>
            <HangmanImage attempts={gameState.attempts} />
        </div>
    )
}