import React, {useState, Fragment, useEffect, useCallback} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardHeader, FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {ArrowDownward, ArrowUpward, Delete, Edit, PlusOne} from "@mui/icons-material";
import ComponentList from "../../components/pageComponents/componentList";
import AddLinks from "../../components/pageComponents/addLinks";
import Items from "../../components/pageComponents/items";
import {get, post} from "../../actions/auth";
import {AUTHALERTNAME, PLATFORMlISTURL, POSTURL, SUCCESSALERT} from "../../utils/texthelper";
import {useNavigate, useParams} from "react-router-dom";
import {addAlert} from "../../store/reducers/alertSlice";
import {useDispatch} from "react-redux";
import Displayalerts from "../../components/displayalerts";
import AddPageBanner from "../../components/pageComponents/addPageBanner";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function AddPage(props) {
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    let {slug} = useParams();
    const [contents,setPageContent] = useState([]);
    const [currentView,setCurrentView] = useState('');
    const [selectedComponent,setSelectedComponent] = useState({});
    const [selectedItemIndex,setSelectedItemIndex] = useState(0);
    const [platforms,setPlatforms] = useState([]);
    const [formFields,setFormFields] = useState({
        name:'',
        contents:'',
        homePage:'',
        textContent:"",
        pageBanners: {
            sideBanners: [],
            sliders:[]
        }
    });


    const setItem = ({target:{name,value}})=>{
        setSelectedComponent(v=>({...v,[name]:value}))
    }

    const views = {
        'componentList':{
            title:'Add Component',
            component:<ComponentList selectedComponent={selectedComponent} selectComponent={setSelectedComponent}/>,
            handleNext(){
                const newContent = [...contents];
                newContent.push(selectedComponent);
                setSelectedItemIndex(newContent.length -1);
                setPageContent(newContent);
                setCurrentView('addItem')
            }
        },
        'addItem':{
            title:'Configure Element',
            component: <AddLinks formSchema={selectedComponent} setData={setItem}/>,
            handleNext(){
                const newContent = [...contents];
                newContent[selectedItemIndex] =selectedComponent;
                setPageContent(newContent);
            }
        },
        'pageImages':{
            title:"Page Images",
            component: <AddPageBanner images={formFields.pageBanners} setData={setData}/>,
            handleNext(){

            }
        }
    }

    const addElement = (type)=>{
        setCurrentView('componentList');
    }



    function setData({target:{name,value}}){
        setFormFields(v=>({...v,[name]:value}))
    }


    const handleNext = (event)=>{
        views[currentView]?.handleNext()
    }

    const deleteItem = (index)=>{
        const newContents = [...contents];
        newContents.splice(index,1);
        setPageContent(newContents);
        if(selectedItemIndex === index){
            setCurrentView('componentList')
            setSelectedItemIndex(0);
            setSelectedComponent({});
        }
    }

    const editItem = (index)=>{
        setSelectedComponent(contents[index]);
        setSelectedItemIndex(index);
        if(currentView !== 'addItem'){
            setCurrentView('addItem');
        }
    }

    const move = (index,moveTo)=>{
        const currentElement = contents[index];
        const moveToElement = contents[moveTo]||'';
        if(moveToElement){
            const newContents = [...contents];
            newContents[moveTo] = currentElement;
            newContents[index] = moveToElement;
            setPageContent(newContents);
        }
    }

    const savePage = ()=>{
        const data = {...formFields,contents:contents}
        const extra = (slug)?`/${data.id}`:'';
        post(`${POSTURL}${extra}`,data).then(resp=>{
            const {status,post} = resp.data;
            if(status){
                dispatch(addAlert({
                    name: AUTHALERTNAME,
                    message:(slug)?'Page Updated Successfully':'Page Created Successfully' ,
                    status:SUCCESSALERT
                }));
                if(!slug){
                    setTimeout(()=>{
                        navigate(`/pages/edit/${post.slug}`)
                    },2000)
                }

            }else{
                dispatch(addAlert({
                    name: AUTHALERTNAME,
                    message:'Error Creating Page',
                }));
            }

        }).catch(err=>{
            dispatch(addAlert({
                name: AUTHALERTNAME,
                message: err.response?.data?.message||'Error Creating Page',
            }));
        })

    }

    const getPage = useCallback(
        ()=>{
            get(`${POSTURL}/${slug}`)
                .then((resp)=>{
                    const {status,post} = resp.data;
                    if(status){
                        const contents = post.contents.map((content)=>{
                            const newContent = {...content};
                            newContent.itemsPreview = content.items;
                            newContent.items = content.items.map(item=>item.id);
                            if(content.itemsType === 'products'){
                                newContent.sku = content.items.map(item=>item.sku);
                            }
                            return newContent;
                        });
                        setFormFields(post);
                        setPageContent(contents);
                    }
                })
        },[slug])



    const getPlatforms = ()=>{
        get(PLATFORMlISTURL).then((resp)=>{
            const {status,platforms}= resp.data;
            if(status){
                setPlatforms(platforms);
            }
        }).catch(e=>{

        });
    }


    useEffect(()=>{
        if(slug){
            getPage();
        }
        getPlatforms();
    },[getPage,slug]);




    return (
       <Fragment>
           <Grid container>
               <Grid item className={'flex flex-center margin-top-bottom'} sm={12}>
                   <Displayalerts name={AUTHALERTNAME}></Displayalerts>
               </Grid>
               <Grid item sm={4}>

               </Grid>
               <Grid item sm={8}>
                   <Grid container>
                       <Grid item sm={12} className={'margin-top-bottom'}>
                           <Button variant={'contained'} onClick={()=>setCurrentView('pageImages')}>
                              add home sliders and banners
                           </Button>
                       </Grid>
                       <Grid item sm={12}>
                           <TextField value={formFields.name} label={'page name'} name={'name'} onChange={setData}/>
                       </Grid>
                       <Grid item sm={12}>
                       <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-label">Set as Home Page for</InputLabel>
                           <Select
                               labelId="demo-simple-select-label"
                               value={formFields.homePage}
                               label="Set as Home Page"
                               name={'homePage'}
                               onChange={setData}
                           >
                               <MenuItem value={""}>Not as home page</MenuItem>
                               {
                                   platforms.map( platform=>(<MenuItem key={platform.id}  value={platform.key}>{platform.name}</MenuItem>))
                               }
                           </Select>
                       </FormControl>
                       </Grid>
                       <Grid item sm={12} className={'flex flex-center'}>
                           <div style={{
                               width:'100%',
                               marginTop:'30px',
                               marginBottom:'20px',
                           }} >
                               <CKEditor
                                   style={{
                                       width:'100%',
                                       marginTop:'30px',
                                       marginBottom:'20px',
                                       height:'450px'
                                   }}
                                   editor={ ClassicEditor }
                                   data={formFields.textContent || ''}
                                   onChange={ ( event, editor ) => {
                                       const data = editor.getData();
                                      setData({target:{
                                          name:'textContent',
                                              value:data
                                          }})
                                   } }
                               />
                           </div>

                       </Grid>
                       <Grid item sm={12} className={'flex flex-center'}>
                           <Button variant={'contained'} onClick={()=>addElement('prepend')}>
                               <PlusOne></PlusOne>
                           </Button>
                       </Grid>
                       <Grid item sm={12}>
                           {
                               contents.map((content,index)=> {
                                       const className = [];
                                       if(content.hideImageName){
                                           className.push('no-image-name')
                                       }
                                       return (<Card className={'col'} key={index}>
                                               <div>
                                                   <Button variant={'contained'} onClick={()=>{move(index,index-1)}}><ArrowUpward/></Button>
                                                   <Button variant={'contained'} onClick={()=>{editItem(index)}}> <Edit></Edit></Button>
                                                   <Button variant={'contained'} onClick={()=>{deleteItem(index)}}> <Delete></Delete></Button>
                                                   <Button variant={'contained'} onClick={()=>{move(index,index+1)}}> <ArrowDownward/></Button>

                                               </div>
                                               {
                                                   (content.title)
                                                   &&
                                                   <div>
                                                       <h3>{content.title}
                                                           {
                                                               content.subtitle
                                                               &&
                                                               <span>
                                                       | {
                                                                   content.subtitle
                                                               }
                                                   </span>
                                                           }
                                                       </h3>
                                                   </div>
                                               }

                                               <Grid container className={`${className.join(" ")} `} spacing={3} >
                                                   {
                                                       <Items items={content.itemsPreview} viewType={content.type} cols={content.cols} />
                                                   }
                                               </Grid>
                                           </Card>
                                       )
                                   }
                               )
                           }
                       </Grid>
                       <Grid item sm={12} className={'flex flex-center'}>
                           <Button variant={'contained'} onClick={()=>addElement('append')}>
                               <PlusOne ></PlusOne>
                           </Button>
                       </Grid>
                   </Grid>
               </Grid>
           </Grid>
           <div className={'flex flex-center side-panel'} >
               <Card style={{width:'100%',padding:'10px'}} className={'card-cover'} >
                   <CardHeader
                       title={views[currentView]?.title||""}
                   />
                   <Grid container spacing={2} className={'content-area'} >
                       {
                           views[currentView]?.component||""
                       }
                   </Grid>
                   <CardActions className={'card-footer'}>
                       <Button size="small" variant={'contained'} onClick={handleNext}>Done</Button>
                       <Button size="small" variant={'contained'} onClick={savePage}>SaveData</Button>
                   </CardActions>
               </Card>
           </div>

       </Fragment>
    );
}

export default AddPage;