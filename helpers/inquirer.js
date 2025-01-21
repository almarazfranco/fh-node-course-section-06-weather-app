import inquirer from 'inquirer';
import 'colors'


//! ====================================== > Menu
const inquirerMenu = async (lng_appTitle, lng_menu) => {
  console.clear();

  const questions = [
    {
      type: 'list',
      name: 'option',
      message: lng_menu.menuTitle,
      choices: [
        {
          value: 1,
          name: `🔹 ${lng_menu.menuOption1}`
        },
        {
          value: 2,
          name: `🔹 ${lng_menu.menuOption2}`
        },
        {
          value: 0,
          name: `🔸 ${lng_menu.menuOption3}`
        }
      ]
    }
  ]

  console.log('\n=========================='.blue)
  console.log(`       ${lng_appTitle}` .rainbow)
  console.log('==========================\n'.blue)

  const { option } = await inquirer.prompt(questions)

  return option
}

//! ====================================== > Select search languague

const inquirerSelectAppLanguague = async () => {
  console.clear();

  const { languague } = await inquirer.prompt([
    {
      type: 'list',
      name: 'languague',
      message: 'Select App languague',
      choices: [
        {
          value: "sp",
          name: `🔸 Spanish`
        },
        {
          value: "en",
          name: `🔹 English`
        }
      ]
    }
  ])

  return languague
}


//! ====================================== > Pause

const inquirerPauseInput = async (message) => {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'pause',
      message
    }
  ])
}


//! ====================================== > Read input

const inquirerReadInput = async (message, valueName, err) => {
  console.clear();

  const input = await inquirer.prompt([
    {
      type: 'input',
      message,
      name: valueName,
      validate(value) {
        if(value.length === 0) {
          return err
        }
        return true
      }
    }
  ])
  return input
}


//! ====================================== > Delete Task
const inquirerSelectPlace = async (places, cancel, choceMessage) => {
  
  console.clear();
  console.log('\n')
  const choices = places.map((t) => {
    return {
      value: t.id,
      name: `🔹 ${t.name}`
    }
  })

  choices.push({
    value: 0,
    name: `🔸 ${cancel}`
  })

  const questions = [
    {
      type: 'list',
      name: 'id',
      message: choceMessage,
      choices: choices
    }
  ]
  return await inquirer.prompt(questions)
}


export {
  inquirerMenu,
  inquirerPauseInput,
  inquirerReadInput,
  inquirerSelectAppLanguague,
  inquirerSelectPlace
}