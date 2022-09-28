import {v4 as uuidv4} from "uuid";
export const generateId = ()=>{
    return uuidv4();
}

export const buildCustomEvent = (name,value)=>{
    return {
        target:{
            name,
            value
        }
    }
}

export const getInputFiles = async (inputFiles) => {
    const keys = Object.keys(inputFiles);
    let files = keys.map((key) => {
        const file = inputFiles[key];
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                resolve({file,preview:fileReader.result});
            }
            fileReader.readAsDataURL(file);
        });
    });

    return await Promise.all(files);
}

export function convertToForm(form,formSchema=null){
    const formData = new FormData();
        buildData(form,formData,formSchema,);
        return formData;
}

function buildData(form,formData,formSchema=null ,name=""){
    const SchemaKeys = (formSchema)?Object.keys(formSchema):Object.keys(form);
    console.log(SchemaKeys);
    for(let key of SchemaKeys) {
        const value = form[key];
        const fieldname = name||key ;
        if(typeof value == 'object' && Array.isArray(value)) {
            console.log('its object and array');
            buildData(value,formData,null,`${fieldname}[]`);
        }else{
            formData.append(fieldname, value);
        }
    }
}

console.log(process.env)

