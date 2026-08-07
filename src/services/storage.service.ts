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
         // if data has id then loop of currentData: if item.id is data.id then item = data else return false
         // if data has not id then currentData.push(data)
           
         await writeFile(file_path, JSON.stringify(currentData, null, 2), 'utf-8')
      
         console.log("Success saved data in json file: ", currentData.length)
        } catch (error) {
        console.error("Failed to write file")
      }

}

// update in json file
const updateInJson = async (folder_name: string, file_name: string, data: any) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

      if(!data.id){
        console.log("cannot update in json because data has no id")
        return
      }

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

         console.log("[StorageService] updateInJson() currentData before:", currentData)

         currentData = currentData.map((m) => {
          if (m.id == data.id){
              m = data
          }
          return m
        })

         console.log("[StorageService] updateInJson() currentData after:", currentData)

        
         // if data has id then loop of currentData: if item.id is data.id then item = data else return false
         
           
         await writeFile(file_path, JSON.stringify(currentData, null, 2), 'utf-8')
      
         console.log("Success updated data in json file: ", currentData.length)
         return true
        } catch (error) {
        console.error("Failed to write file")
        return false
      }

}

// remove in json file
const removeInJson = async (folder_name: string, file_name: string, id: any) => {
      const folder_path = join(process.cwd(), folder_name)
      const file_path = join(folder_path, `${file_name}.json`)

      if(!id){
        console.log("cannot remove in json because no id")
        return
      }

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

         console.log("[StorageService] removeInJson() currentData before:", currentData)

         currentData = currentData.map((m) => {
          if(m.id != id){
            return m
          }
         })

         console.log("[StorageService] removeInJson() currentData after:", currentData)

         //await writeFile(file_path, JSON.stringify(currentData, null, 2), 'utf-8')
      
         //console.log("Success saved data in json file: ", currentData.length)
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
    updateInJson,
    removeInJson,
    saveData,
    readFromJsonAsObject,
    removeJsonFile,
}