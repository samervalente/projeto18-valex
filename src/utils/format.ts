export default function formatEmployeeName(name: string){
    let arr = name.split(" ")
    let concat:string = ""
    for(let i = 0; i < arr.length ; i ++){
      if(arr[i].length > 3){
        if(i !== 0 && i !== arr.length - 1 && arr[i].length >= 3){
          let inicial = ""
          inicial = arr[i].split("")[0]
          concat += ` ${inicial}`
        }else{
          concat += ` ${arr[i]}`
        }
      }
      
    }
    return concat
  }