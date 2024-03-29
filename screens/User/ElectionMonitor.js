import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput, Alert, Pressable, StyleSheet, ScrollView , Button} from 'react-native'
import React, {useState, useEffect} from 'react';
import GoBack from '../../components/General/GoBack';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AsyncStorage from '@react-native-async-storage/async-storage';




import { Formik } from 'formik';
import * as Yup from 'yup';
import  Validator  from 'email-validator';
import { Auth,Storage,API } from 'aws-amplify';
import { UserProfile } from '../../src/models';

import BottomTab, {bottomTabIcons} from '../../components/Home/BottomTab';
import {Dropdown} from 'react-native-element-dropdown';

import { DataStore } from '@aws-amplify/datastore';
import { ElectionMonitor, EMPresidential, EMGovernorship, EMSenatorial, EMHor, EMHoa } from '../../src/models';


import uuid from 'react-native-uuid';




const ElectionMonitors = ({navigation}) => {


    const [isFocus, setisFocus] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null);
    const [ElectionType, setElectionType] = useState(null);
    const [UserId, setUserId] = useState('');
    const [PuDelimitation, setPuDelimitation] = useState('');
    const [StateId, setStateId] = useState('');
    const [LgaId, setLgaId] = useState('');
    const [WardId, setWardId] = useState('');
    const [LgaUnique, setLgaUnique] = useState('');



    const [isSubmitting, setIsSubmitting] = useState(false)






    const getUser = async () => {
        // get user  from cognito
        const userInfo = await Auth.currentAuthenticatedUser();
    
        if (!userInfo) {
          return;
        }
        const userId = userInfo.attributes.sub;
    
        setUserId(userId)

        return userId;
    
    
      }


      const getPu = async (pu) => {

        try {
            const values = await AsyncStorage.getItem('@userProfile');
            const parsedValue = values ? JSON.parse(values) : {}
            if(!parsedValue){
                // get user  from cognito
                const userInfo = await Auth.currentAuthenticatedUser();
                if (!userInfo) {
                    return;
                }
                const userId = userInfo.attributes.sub;
                const user = (await DataStore.query(UserProfile)).find(userProfile => userProfile.sub === userId);
                setPuDelimitation(user.pu);
                setStateId(user.state_id)
                setLgaId(user.lga_abbreviation)
                setWardId(user.ward_abbreviation)
                setLgaUnique(user.lga_id)

            }else{
                setStateId(parsedValue.state_id)
                setLgaId(parsedValue.lga_abbreviation)
                setWardId(parsedValue.ward_abbreviation)
                setPuDelimitation(parsedValue.pu_id)
                setLgaUnique(parsedValue.lga_id)
            }
          } catch (error) {
            // Error saving data
          } finally{

          }
      }








    const ImageUpload = async (uploadedImage, filename) => {
        try {
            const response = await fetch(uploadedImage);
            const blob = await response.blob();
            const { key } = await Storage.put(`${filename}`, blob);
            console.log(key)
            return key;
          } catch (e) {
            console.log(e);
          }
    }



    useEffect(() =>{
        getPu()
        getPu()
    },[])







    
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: true,
            quality: 1,
        });
    
            console.log(result,'ssusuuu');
    
            if (!result.cancelled) {
                setUploadedImage(result.uri);
            }
       
      };



    const LoginFormSchema = Yup.object().shape({
        // pu: Yup.string().required('Enter your polling unit'),
    })


    const onSubmit = async (pu,a,aa,aac,adc,adp,apc,apga,apm,app,bp,lp,nnpp,nrm,pdp,prp,sdp,ypp,zlp,electionType) =>{
        if(PuDelimitation){
            try{
                console.log('jagaban')
                setIsSubmitting(true)
                let fname = ''

                if(uploadedImage){
                    console.log('ipassed', typeof uploadedImage)
                    const extension = uploadedImage?.split(".");
                    fname = uuid.v4() + '.' +extension[extension.length - 1]
                    const imageurl = uploadedImage ?  await ImageUpload(uploadedImage,fname) : ''

                }
                

                if(ElectionType == 'Presidential'){
                    await DataStore.save(
                        new EMPresidential({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,

                        })
                    );
                }

                else if(ElectionType == 'Governorship'){
                    await DataStore.save(
                        new EMGovernorship({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,

                        })
                    );
                }
                else if(ElectionType == 'Senatorial'){
                    await DataStore.save(
                        new EMSenatorial({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,

                        })
                    );
                }
                else if(ElectionType == 'House of Representatives'){
                    await DataStore.save(
                        new EMHor({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,

                        })
                    );
                }
                else if(ElectionType == 'House of Assembly'){
                    await DataStore.save(
                        new EMHoa({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,

                        })
                    );
                }
                else{
                    await DataStore.save(
                        new ElectionMonitor({
                            "user": await getUser(),
                            "polling_unit": PuDelimitation ? PuDelimitation : pu,
                            "election_type": ElectionType,
                            "votes_a": a ? a : '0',
                            "votes_aa": aa ? aa : '0',
                            "votes_aac": aac ? aac : '0',
                            "votes_adc": adc ? adc : '0',
                            "votes_adp": adp ? adp : '0',
                            "votes_apc": apc ? apc : '0',
                            "votes_apga": apga ? apga : '0',
                            "votes_apm": apm ? apm : '0',
                            "votes_app": app ? app : '0',
                            "votes_bp": bp ? bp : '0',
                            "votes_lp": lp ? lp : '0',
                            "votes_nnpp": nnpp ? nnpp : '0',
                            "votes_nrm": nrm ? nrm : '0',
                            "votes_pdp": pdp ? pdp : '0',
                            "votes_prp": prp ? prp : '0',
                            "votes_sdp": sdp ? sdp : '0',
                            "votes_ypp": ypp? ypp : '0',
                            "votes_zlp": zlp ? zlp : '0',
                            "copy_of_results": fname ? fname : '',
                            "state_id": StateId,
                            "lga_id": LgaId,
                            "ward_id": WardId,
                            "lga_unique": LgaUnique,
                        })
                    );
                }
    
                
    
                navigation.navigate({
                    name: 'Success',
                    params: { source: 'election-monitor' },
                    merge: true,
                  });
    
    
    
            }catch(error){
                console.log(error)
                Alert.alert('Omo e don choke !!!', `Please try again`)
            }finally{
                setIsSubmitting(false)
    
            }
        }else{
            Alert.alert('Polling Unit is Empty', `Enter your polling unit, or complete your profile`)

        }
    }





  return (
        <SafeAreaView className="bg-[#008F43] text-white">











            
            <View className="bg-[#ffffff] h-full relative">



            <View className="flex flex-row space-between justify-between bg-[#008F43] px-[20px] pb-[10px]" style={styles.containerShadow}>
                <View className="flex flex-row gap-[14px] items-center">
                
                        <TouchableOpacity onPress={() => navigation.navigate('MainMenu',{userDetail: ''})}>
                            <Image source={require('../../assets/app/back-icon.png')}/>
                        </TouchableOpacity>
                    
                    <Text className="text-[20px] font-bold text-white" style={{fontFamily: 'Sora-Bold'}}>
                    Polling unit results
                    </Text>

                </View>
                <TouchableOpacity onPress={() => navigation.push('Profile')}>
                    <Image source={{uri: 'https://img.icons8.com/50/ffffff/user-male-circle.png'}} style={[
                        styles.icon,
                    ]} className="text-center justify-center h-[20px] w-[20px]"/>
                </TouchableOpacity>
            </View>














                {/* <View className="flex flex-row justify-between">
                    <View className="bg-[#008F43] flex flex-row gap-[14px] items-center pl-[20px]">
                        <TouchableOpacity onPress={() => navigation.push('MainMenu',{userDetail: ''})}>
                                <Image source={require('../../assets/app/back-icon.png')}/>
                            </TouchableOpacity>
                        <Text className="text-white font-bold text-[20px]  pt-[15px] pb-[15px] mx-auto  w-[90%]">Polling unit results</Text>
                    </View>
                    <View className="bg-yellow-300 flex flex-row">
                        <TouchableOpacity onPress={() => navigation.push('Profile')}>
                            <Image source={{uri: 'https://img.icons8.com/50/ffffff/user-male-circle.png'}} style={[
                                styles.icon,
                            ]} className="text-center justify-center"/>
                                <Text>Super</Text>

                        </TouchableOpacity>

                    </View>
                </View>
                 */}
              




            <Formik 
                initialValues={{pu:`${PuDelimitation ? PuDelimitation : '' }`,a:'',aa:'',aac:'',adc:'',adp:'',apc:'',apga:'',apm:'',app:'',bp:'',lp:''
                    ,nnpp:'',nrm:'',pdp:'',prp:'',sdp:'',ypp:'',zlp:'',electionType: 'Presidential'}}
                onSubmit={(values) => {
                    onSubmit(
                        values.pu,
                        values.a, values.aa, 
                        values.aac, values.adc, 
                        values.adp, values.apc, 
                        values.apga, values.apm, 
                        values.app, values.bp, 
                        values.lp, values.nnpp, 
                        values.nrm, values.pdp, 
                        values.prp, values.sdp, 
                        values.ypp, values.zlp, 
                        values.electionType
                    )
                }}
                validationSchema={LoginFormSchema}
                validateOnMount={true}
            >

                {({handleChange, handleBlur, handleSubmit, values, isValid}) =>(

                    <ScrollView>




                        <View className=" bg-white rounded-[20px] pb-[5px] items-left">
                             
                                <View className="mx-auto w-[100%] mb-[10px] bg-[#EDF2F9] p-[20px]">
                                    <View className="mb-[16px]">
                                        <Text className="text-[#303437] font-bold text-[20px]">Upload your polling unit result</Text>
                                    </View>
                                    <View className="mb-[10px]">
                                        <Text className="text-[14px] font-bold" style={{fontFamily: 'Sora-Bold'}}>Time left to upload result:</Text>
                                        <Text className="text-[14px]" style={{fontFamily: 'Sora-Medium'}}>Next election date - 18th March, 2023</Text>
                                    </View>
                                    <View className="mb-[10px] flex flex-row flex-wrap">
                                        <Text className="text-[14px] font-bold" style={{fontFamily: 'Sora-Bold'}}>Note:</Text>
                                        <Text className="text-[14px]" style={{fontFamily: 'Sora-Medium'}}>
                                        You are highly advised to attach a picture of the INEC result sheet for verification
                                        </Text>
                                    </View>
                                    <View className="mb-[10px] flex flex-row flex-wrap">
                                        <Text className="text-[14px] font-bold" style={{fontFamily: 'Sora-Bold'}}>Your polling unit:</Text>
                                        <Text className="text-[14px]" style={{fontFamily: 'Sora-Medium'}}>&nbsp;
                                        {PuDelimitation ? PuDelimitation : values.pu}
                                        </Text>
                                    </View>
                                    {/* <Image className="h-[200px] w-[300px]" source={require('../../assets/app/pvc.png')} /> */}

                                </View>


                            <View className="px-[20px] pb-[20px]">


                            {/* <View className={`w-[100%] mb-[15px] p-[] `} style={styles.inputField}
                        >
                            <TextInput 
                                placeholder='Enter Polling Unit Eg. 04-01-01-010'
                                autoCapitalize='none'
                                keyboardType='text'
                                textContentType='text'
                                autoFocus={false}
                                onChangeText={handleChange('pu')}
                                onBlur={handleBlur('pu')}
                                value={PuDelimitation ? PuDelimitation : values.pu}
                                className="bg-[#eeeeee]  px-[20px] py-[18px] "/>
                        </View> */}


                                    <View className="mb-[16px] flex flex-row flex-wrap">
                                        <Text className="text-[14px] font-bold" style={{fontFamily: 'Sora-Bold'}}>Input results</Text>
                                    </View>

                        <View className="w-[100%] mb-[15px]">
                                <Dropdown
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    autoFocus={true}
                                

                                    data={[{"electionType": 'Presidential'}, { "electionType": 'Governorship'}, { "electionType": 'Senatorial'}, { "electionType": 'House of Representatives'}, { "electionType": 'House of Assembly'}]}
                                    maxHeight={300}
                                    labelField="electionType"
                                    valueField="electionType"
                                    placeholder={!isFocus ? 'Select Election Type' : '...'}
                                    searchPlaceholder="Search..."
                                    value={ElectionType}
                                    className="border border-[#CDCFD0] rounded-[24px] px-[20px] py-[10px] "
                                    onChange={item => {
                                        handleChange('electionType')
                                        setisFocus(false);
                                        setElectionType(item.electionType)

                                    }}
                                />
                            </View>

                           <View className="items-center">
                           
                           
                           <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-center">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/a.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">Accord</Text>

                                </View>
                                <View className="flex flex-row items-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.a}
                                    onChangeText={handleChange('a')}
                                    onBlur={handleBlur('a')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/aa.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">AA</Text>
                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.aa}
                                    onChangeText={handleChange('aa')}
                                    onBlur={handleBlur('aa')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/aac.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">AAC</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.aac}
                                    onChangeText={handleChange('aac')}
                                    onBlur={handleBlur('aac')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/adc.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">ADC</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.adc}
                                    onChangeText={handleChange('adc')}
                                    onBlur={handleBlur('adc')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>



                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/adp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">ADP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.adp}
                                    onChangeText={handleChange('adp')}
                                    onBlur={handleBlur('adp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/apc.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">APC</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.apc}
                                    onChangeText={handleChange('apc')}
                                    onBlur={handleBlur('apc')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>


                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/apga.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">APGA</Text>
                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.apga}
                                    onChangeText={handleChange('apga')}
                                    onBlur={handleBlur('apga')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/apm.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">APM</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.apm}
                                    onChangeText={handleChange('apm')}
                                    onBlur={handleBlur('apm')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>


                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/app.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">APP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.app}
                                    onChangeText={handleChange('app')}
                                    onBlur={handleBlur('app')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/bp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">Boot Party</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.bp}
                                    onChangeText={handleChange('bp')}
                                    onBlur={handleBlur('bp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/lp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">Labour</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.lp}
                                    onChangeText={handleChange('lp')}
                                    onBlur={handleBlur('lp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/nnpp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">NNPP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.nnpp}
                                    onChangeText={handleChange('nnpp')}
                                    onBlur={handleBlur('nnpp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/nrm.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">NRM</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.nrm}
                                    onChangeText={handleChange('nrm')}
                                    onBlur={handleBlur('nrm')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/pdp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">PDP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.pdp}
                                    onChangeText={handleChange('pdp')}
                                    onBlur={handleBlur('pdp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>


                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/prp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">PRP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.prp}
                                    onChangeText={handleChange('prp')}
                                    onBlur={handleBlur('prp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/sdp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">SDP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.sdp}
                                    onChangeText={handleChange('sdp')}
                                    onBlur={handleBlur('sdp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>

                        {/* shadow-[0px_4px_4px_4px_#00000057] */}
                        <View className="flex flex-row gap-5 mb-[15px]">
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/ypp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">YPP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.ypp}
                                    onChangeText={handleChange('ypp')}
                                    onBlur={handleBlur('ypp')}
                                    className="bg-[#fff]  border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                            <View className="flex flex-row items-left justify-left">
                                <View className="items-center mt-[15px]">
                                    <Image source={require('../../assets/party/zlp.png')} className='h-[60px] w-[60px]'/>
                                    <Text className="pt-[5px] text-center">ZLP</Text>

                                </View>
                                <View className="flex flex-row  items-center justify-center">
                                    <Text>&nbsp;:&nbsp;</Text>
                                    <TextInput keyboardType='numeric' placeholder='0'
                                    value={values.zlp}
                                    onChangeText={handleChange('zlp')}
                                    onBlur={handleBlur('zlp')}
                                    className="bg-[#fff] border-[#CDCFD0] border px-[20px] py-[18px] rounded-[24px] "/>

                                </View>
                            </View>
                        </View>
                           
                           
                           
                           
                           
                           
                           
                           </View>

                        <View className="w-[100%] mb-[15px]" style={styles.inputField}>
                            <Text className="text-[18px] font-semi-bold mb-[10px]">Have a copy of the result ?</Text>
                                
                                {

                                    !uploadedImage ? 
                                    <TouchableOpacity onPress={pickImage}>
                                    <View className="items-center">
                                        <View className="w-[100%] mx-auto h-[80px] bg-[#ffffff] items-center justify-center flex shadow-2xl rounded-lg">
                                            <Icon name="upload" size={30} color="#000" />
                                            <Text className="text-[#008F43] text-[12px]" style={{fontFamily: 'Sora-Medium'}}>Click to Upload</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity> 
                                :  <TouchableOpacity onPress={pickImage}>
                                        <View className="items-center">
                                            {uploadedImage && <Image source={{ uri: uploadedImage }} style={{ width: 200, height: 200 }} />}
                                        </View>
                                    </TouchableOpacity>

                                }
                        </View>

               


                        <View className="w-[100%] mb-[20px] pb-[20px] flex justify-end">
                        {/* disabled={(isSubmitting ? true : (PuDelimitation?.length ? true : isValid ))} */}
                            <TouchableOpacity style={isSubmitting ? styles.button(false) : styles.button(isValid)} onPress={handleSubmit} disabled={!isValid || isSubmitting || !PuDelimitation?.length || !ElectionType}>
                                <View className="px-[32px] py-[15px] rounded-[40px] text-[#fff] shadow-2xl"  >
                                    <Text className="text-white text-center text-[12px] font-bold" style={{fontFamily: 'Sora-Medium'}}>
                                    {
                                        isSubmitting ? 'Uploading...' : 'Submit Polling Unit Result'
                                    }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
















                            </View>

                        


                        </View>








                    </ScrollView>
                )}



            </Formik>




                



                
            </View>


            <BottomTab icons={bottomTabIcons} navigation={navigation} tabName='ElectionMonitor'/>

        </SafeAreaView>
  )
}



const styles = StyleSheet.create({
    wrapper:{
        marginTop: 80,
    },
    inputField:{
        marginBottom: 10,
        // boxShadow: '2px 0px 1px #0000008a',
        // shadowColor: '#0000008a',
        // shadowOffset: {width: -1, height: 3},
        // shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    button: isValid =>({
        backgroundColor: isValid ? '#008F43' : '#b5e2cd',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 30
    }),
    buttonText:{
        fontWeight: 600,
        color: '#fff',
        fontSize: 20
    },
    signupContainer:{
        flexDirection: 'row',
        width: '100%',
        marginTop: 50,
        justifyContent: 'center'
    },
    dropdown: {
        height: 50,
        borderColor: '#CDCFD0',
        borderWidth: 0.5,
        borderRadius: 24,
        paddingHorizontal: 8,
        marginBottom: 10,
      },
      icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      }, 
})

export default ElectionMonitors