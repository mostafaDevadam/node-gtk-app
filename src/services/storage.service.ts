import { mkdir, writeFile, readFile, rm } from 'fs/promises'
import { join } from 'path'



const readFromJson = async (folder_name: string, file_name: string) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

       try{
         await mkdir(folder_path, {recursive: true})

         let currentData : any[] = []
         
         try {
          const rawFileContent = await readFile(file_path, "utf-8")
          currentData = JSON.parse(rawFileContent)

          if(!Array.isArray(currentData)){
            currentData = [currentData]
          }
          
         } catch (error: any) {
            if(error.code !== 'ENOENT') throw error
         }

         
           
         
      
         console.log("Success loaded data from json file: ", currentData.length)
         return currentData
        } catch (error) {
        console.error("Failed to write file")
      }

}

const readFromJsonAsObject = async (folder_name: string, file_name: string) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

       try{
         await mkdir(folder_path, {recursive: true})

         let currentData = {}
         
         try {
          const rawFileContent = await readFile(file_path, "utf-8")
          currentData = JSON.parse(rawFileContent)

          
          
         } catch (error: any) {
            if(error.code !== 'ENOENT') throw error
         }

         
         console.log("Success loaded data from json file as object: ", currentData)
         return currentData
        } catch (error) {
        console.error("Failed to read json file as object")
      }

}

const saveInJson = async (folder_name: string, file_name: string, data: any) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

       try{
         await mkdir(folder_path, {recursive: true})

         let currentData : any[] = []
         
         try {
          const rawFileContent = await readFile(file_path, "utf-8")
          currentData = JSON.parse(rawFileContent)

          if(!Array.isArray(currentData)){
            currentData = [currentData]
          }
          
         } catch (error: any) {
            if(error.code !== 'ENOENT') throw error
         }

         currentData.push(data)
           
         await writeFile(file_path, JSON.stringify(currentData, null, 2), 'utf-8')
      
         console.log("Success saved data in json file: ", currentData.length)
        } catch (error) {
        console.error("Failed to write file")
      }

}

const saveData = async (folder_name: string, file_name: string, data: any) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

      try{
         await mkdir(folder_path, {recursive: true})
           
         await writeFile(file_path, JSON.stringify(data, null, 2), 'utf-8')
      
         console.log("Success saved data in json file")
        } catch (error) {
        console.error("Failed to write file")
      }
}

const removeJsonFile = async (folder_name: string, file_name: string) => {
      const file_path = join(process.cwd(), folder_name, `${file_name}.json`)
      try {
        await rm(file_path, {force: true})
        console.log("success removed json file")
        return true
      }catch(error) {
        console.log("cannot remove json file")
        return false
      }

}


export const StorageService = {
    readFromJson,
    saveInJson,
    saveData,
    readFromJsonAsObject,
    removeJsonFile,
}