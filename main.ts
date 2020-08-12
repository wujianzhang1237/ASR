/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from wujianzhang
load dependency
"Asr": "file:../pxt-Asr"
*/

//% color="#006400" weight=20 icon="\uf170"
namespace Asr {
    const I2C_ADDR = 0x0d                   //语音识别模块地址
    const ASR_ADD_WORD_ADDR = 0x01          //词条添加地址
    const ASR_MODE_ADDR = 0x02              //识别模式设置地址，值为0-2，0:循环识别模式 1:口令模式 ,2:按键模式，默认为循环检测
    const ASR_RGB_ADDR = 0x03               //RGB灯设置地址,需要发两位，第一个直接为灯号1：蓝 2:红 3：绿 ,第二个字节为亮度0-255，数值越大亮度越高
    const ASR_REC_GAIN = 0x04               //识别灵敏度设置地址，灵敏度可设置为0x00-0x7f，值越高越容易检测但是越容易误判，建议设置值为0x40-0x55,默认值为0x40
    const ASR_CLEAR_ADDR = 0x05             //清除掉电缓存操作地址，录入信息前均要清除下缓存区信息,随意写0x00-0xff都可以清除
    const ASR_KEY_FLAG = 0x06               //用于按键模式下，设置启动识别模式
    const ASR_VOICE_FLAG = 0x07             //用于设置是否开启识别结果提示音
    const ASR_RESULT = 0x08                 //识别结果存放地址
    
    const DELAY  = 100;//I2C之间延时间隔ms
    //% blockId=Asr_Asr_Add_Words block="Asr_Add_Words|value %value|str %str"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Asr_Add_Words(value: number,str: string): void {
        let asr_txt = str;
        let num = asr_txt.length + 2;

        let buf = pins.createBuffer(num);
        buf[0] = ASR_ADD_WORD_ADDR;
        buf[1] = value;
        for(let i =2;i<num;i++)
        {
            buf[i] = asr_txt.charCodeAt(i-2);
        }

        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }

    //% blockId=Asr_Asr_Clear_Buffer block="Asr_Clear_Buffer"
    //% weight=97
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12    
    export function Asr_Clear_Buffer():void{
        let buf = pins.createBuffer(2);

        buf[0] = ASR_CLEAR_ADDR;
        buf[1] = 0x40;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);

        basic.pause(12000);//必须足够的延时用于擦除
    }

    //% blockId=Asr_Asr_Set_RGB block="Asr_Set_RGB|red %red|green %green|blue %blue"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Set_RGB(red: number, green: number, blue: number): void {
        let buf = pins.createBuffer(4);
        buf[0] = ASR_RGB_ADDR;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }


    //% blockId=Asr_Asr_Set_Mode block="Asr_Set_Mode|mode_num %mode_num"
    //% weight=99
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Set_Mode(mode_num: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_MODE_ADDR;
        buf[1] = mode_num;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }
    
    //% blockId=Asr_Asr_Gain block="Asr_Gain|gain %gain"
    //% weight=95
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Gain(gain: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_REC_GAIN;
        buf[1] = gain;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }
    
    //% blockId=Asr_Asr_Voice block="Asr_Voice|voice %voice"
    //% weight=94
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12 
    export function Asr_Voice(voice: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_VOICE_FLAG;
        buf[1] = voice;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }


    //% blockId=Asr_Asr_Key_ON block="Asr_Key_ON"
    //% weight=93
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12 
    export function Asr_Key_ON(voice: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_KEY_FLAG;
        buf[1] = 1;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }


    //% blockId=Asr_Asr_Result block="Asr_Result"
    //% weight=92
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Asr_Result(): number {

        let buf = pins.createBuffer(1);
        buf[0] = ASR_RESULT;       
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);  

        let result = pins.i2cReadBuffer(I2C_ADDR, 1, false);
        return result[0];
    } 
 
}
