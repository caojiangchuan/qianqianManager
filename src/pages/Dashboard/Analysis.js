import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼状图
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// 引入图例组件
import 'echarts/lib/component/legend'
import styles from './Analysis.less';
import {connect} from "dva";
import {
    Row,
    Col,
    Form
} from 'antd';

@connect(({analysis, loading}) => ({
    analysis,
    loading: loading.effects['analysis/fetch'],
}))
@Form.create()

class Labelline extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            allRegistAuth:'',
            allRegistNotauth:'',
            ydAddAuth:'',
            ydAddNotAuth:'',
            wkAddAuth:'',
            wkAddNotAuth:'',
            monthAddAuth:'',
            monthAddNotAuth:'',
            allRegistAuthPeople:'',
            allRegistNotauthPeople:'',
            ydAddAuthPeople:'',
            ydAddNotAuthPeople:'',
            wkAddAuthPeople:'',
            wkAddNotAuthPeople:'',
            monthAddAuthPeople:'',
            monthAddNotAuthPeople:'',
            data1:123
        }
    }
    // 加载数据
componentWillMount(){

}

    componentDidMount(){
        this.getData()

    };
    getData = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'analysis/fetch',
            callback: response => {
                this.setState({
                    allRegistAuth:parseInt(response.data[1][0].percent),
                    allRegistNotauth:parseInt(response.data[0][0].percent),
                    ydAddAuth:parseInt(response.data[3][0].percent),
                    ydAddNotAuth:parseInt(response.data[2][0].percent),
                    wkAddAuth:parseInt(response.data[5][0].percent),
                    wkAddNotAuth:parseInt(response.data[4][0].percent),
                    monthAddAuth:parseInt(response.data[7][0].percent),
                    monthAddNotAuth:parseInt(response.data[6][0].percent),
                    allRegistAuthPeople:response.data[1][0].people,
                    allRegistNotauthPeople:response.data[0][0].people,
                    ydAddAuthPeople:response.data[3][0].people,
                    ydAddNotAuthPeople:response.data[2][0].people,
                    wkAddAuthPeople:response.data[5][0].people,
                    wkAddNotAuthPeople:response.data[4][0].people,
                    monthAddAuthPeople:response.data[7][0].people,
                    monthAddNotAuthPeople:response.data[6][0].people,
                },()=>{
                    this.pie()
                })


            }
        });
    };
    pie=()=>{
        let myChart = echarts.init(document.getElementById('pie'));
        let myChart2 = echarts.init(document.getElementById('pie2'));
        let myChart3 = echarts.init(document.getElementById('pie3'));
        let myChart4 = echarts.init(document.getElementById('pie4'));
        let myChart5 = echarts.init(document.getElementById('pie5'));
        let myChart6 = echarts.init(document.getElementById('pie6'));
        let myChart7 = echarts.init(document.getElementById('pie7'));
        let myChart8 = echarts.init(document.getElementById('pie8'));

        // 总共人数
        myChart.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name:  `已认证${this.state.allRegistAuthPeople}人:${this.state.allRegistAuth}%`, value: this.state.allRegistAuth, itemStyle: {
                            normal: {
                                color: '#f47f7c'
                            }
                        }},
                    {name: `未认证${this.state.allRegistNotauthPeople}人:${this.state.allRegistNotauth}%`, value: this.state.allRegistNotauth, itemStyle: {
                            normal: {
                                color: '#f5ce6b'
                            }
                        }}
                ]
            }
        });
        //昨日人数
        myChart2.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name: `已认证${this.state.ydAddAuthPeople}人:${this.state.ydAddAuth}%`, value: this.state.ydAddAuth, itemStyle: {
                            normal: {
                                color: '#f47f7c'
                            }
                        }},
                    {name: `未认证${this.state.ydAddNotAuthPeople}人:${this.state.ydAddNotAuth}%`, value: this.state.ydAddNotAuth, itemStyle: {
                            normal: {
                                color: '#f5ce6b'
                            }
                        }}

                ]
            }
        });
        //本周人数
        myChart3.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },

                data: [
                    {name: `已认证${this.state.wkAddAuthPeople}人:${this.state.wkAddAuth}%`, value: this.state.wkAddAuth, itemStyle: {
                            normal: {
                                color: '#f47f7c'
                            }
                        }},
                    {name: `未认证${this.state.wkAddNotAuthPeople}人:${this.state.wkAddNotAuth}%`, value: this.state.wkAddNotAuth, itemStyle: {
                            normal: {
                                color: '#f5ce6b'
                            }
                        }}
                ]
            }
        });
        //本月人数
        myChart4.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name:  `已认证${this.state.monthAddAuthPeople}人:${this.state.monthAddAuth}%`, value: this.state.monthAddAuth, itemStyle: {
                            normal: {
                                color: '#f47f7c'
                            }
                        }},
                    {name: `未认证${this.state.monthAddNotAuthPeople}人:${this.state.monthAddNotAuth}%`, value:this.state.monthAddNotAuth, itemStyle: {
                            normal: {
                                color: '#f5ce6b'
                            }
                        }}

                ]
            }
        });
        //空饼图
        myChart5.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name: '新增人数为空', value: this.state.monthAddAuth, itemStyle: {
                            normal: {
                                color: 'white'
                            }
                        }},



                ]
            }
        });
        //空饼图
        myChart6.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name: '新增人数为空', value: this.state.monthAddAuth, itemStyle: {
                            normal: {
                                color: 'white'
                            }
                        }},



                ]
            }
        });
        //空饼图
        myChart7.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name: '新增人数为空', value: this.state.monthAddAuth, itemStyle: {
                            normal: {
                                color: 'white'
                            }
                        }},



                ]
            }
        });
        //空饼图
        myChart8.setOption({

            series: {
                type: 'pie',
                label: {
                    normal: {
                        position: 'inner',
                        color: 'black'
                    }
                },
                data: [
                    {name: '新增人数为空', value: this.state.monthAddAuth, itemStyle: {
                            normal: {
                                color: 'white'
                            }
                        }},



                ]
            }
        });

    }
    render() {

        return (
            <div className={styles.indexStyle}>
                <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div style={{width: '300px', height:'400px',margin:'auto'} }>
                        {this.state. allRegistAuth===0&&this.state.allRegistNotauth===0? <div id="pie5" style={{width: '300px', height:'300px'} }></div>:<div id="pie" style={{width: '300px', height:'300px'} }></div>}

                    <p style={{margin:'0 auto'} }>注册账户总数</p>
                    </div>
                </Col>
                <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div style={{width: '300px', height:'400px',margin:'auto'} }>
                        {this.state.ydAddAuth===0&&this.state.ydAddNotAuth===0? <div id="pie6" style={{width: '300px', height:'300px'} }></div>:<div id="pie2" style={{width: '300px', height:'300px'} }></div>}

                        <p style={{margin:'0 auto'} }>昨日新增注册数</p>
                    </div>
                </Col>
                <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div style={{width: '300px', height:'400px',margin:'auto'} }>
                        {this.state. wkAddAuth===0&&this.state.wkAddNotAuth===0? <div id="pie7" style={{width: '300px', height:'300px'} }></div>:<div id="pie3" style={{width: '300px', height:'300px'} }></div>}

                        <p style={{margin:'0 auto'} }>本周新增注册数</p>
                    </div>
                </Col>
                <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div style={{width: '300px', height:'400px',margin:'auto'} }>
                        {this.state. monthAddAuth===0&&this.state.monthAddNotAuth===0? <div id="pie8" style={{width: '300px', height:'300px'} }></div>:<div id="pie4" style={{width: '300px', height:'300px'} }></div>}

                        <p style={{margin:'0 auto'} }>本月新增注册数</p>
                    </div>
                    <div id="pie5" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie2" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie3" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie4" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie6" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div  id="pie7" style={{width: '300px', height:'300px', display:'none'} }></div>
                    <div id="pie8" style={{width: '300px', height:'300px', display:'none'} }></div>

                </Col>

            </div>
        )
    }

}

export default Labelline;
