import React from "react";
import moment from "moment";
import { Select, Tree, TreeSelect ,Tooltip} from "antd";

const Option = Select.Option;

class Utils {
  // 日起转换
  formatDate = text => {
    if (text != null) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    } else {
      return "";
    }
  };

  formatDateYMDHS = text => {
    if (text != null) {
      return moment(text).format("YYYY-MM-DD HH:mm");
    } else {
      return "";
    }
  };

  formatDateYMD = text => {
    if (text != null) {
      return moment(text).format("YYYY.MM.DD");
    } else {
      return "";
    }
  };

    formatDateForSearch = text => {
        if (text != null) {
            return moment(text).format("YYYY-MM-DD");
        } else {
            return "";
        }
    };

    formatDateYYYYMMDD = text => {
        if (text != null) {
            return moment(text).format("YYYYMMDD");
        } else {
            return "";
        }
    };

  // 根据指定列名获取下拉框
  dropDownOption = (source, val, name) => {
    if (this.isNotNull(source)) {
      return source.map(d => <Option key={d[val]}>{d[name]}</Option>);
    }
  };

  // 判断字符串是否为空
  isNotNull = value => {
    return !/(null|undefined|^(?![\s\S]))/.test(value);
  };

  //根据状态码获取状态值
  getStatusName = (text, array) => {
    let name = { name: text, value: text };
    if (this.isNotNull(array)) {
      if (this.isNotNull(text)) {
        name = array.filter(item => {
          return `${text}` === item.value;
        });
        if (name.length > 0) {
          return name[0].name;
        } else {
          return text;
        }
      } else {
        return text;
      }
    }
  };

    //字符串脱敏
    handleSensitiveField =(text) =>{
        //如果是手机号
        if(11===text.length){
            return `${text.substring(0,3)}****${text.substring(7,11)}`
        }else if(18===text.length){
            return `******${text.substring(14,18)}`
        }else if(text.length>11 && text.length !==18){
            return this.overLength(text);
        }else{
            return text;
        }
    }

    //超出长度显示部分
    overLength(text){
        if(null!=text && text.length>7){
            return <Tooltip title={text}>
                <span>{text.substring(0,7)}...</span>
            </Tooltip>
        }else {
            return text;
        }
    }

    //隐藏账户号
    handleAccountNo =(text)=>{
        return `${text.substring(0,4)}*${text.substring(text.length-4,text.length)}`
    }

    //接口响应状态判断
    success= (respose)=>{
        if(this.isNotNull(respose)){
            return '0000'===respose.respCode?true:false;
        }else{
            return false;
        }
    }

    getDats =(end,start)=>{
        return Math.ceil((start -end)/86400000)
    }
}




export default Utils;
