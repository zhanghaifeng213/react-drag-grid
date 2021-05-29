import React, { PureComponent } from 'react';
import { Layout,Button } from 'antd';
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from 'echarts-for-react';
import { getBarChart,getLineChart,getPieChart } from "./chart";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content} = Layout;

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  constructor(props) {
    super(props);
    this.getFromLS()
    this.state = {
      layouts: {},
      widgets:[]
    }
  }

  getFromLS() {
    new Promise(()=>{
      setTimeout(()=>{
        // 第一步：模拟网络请求获取layouts
        let layouts={
          "lg":[
            {"w":3,"h":2,"x":0,"y":0,"i":"1622283565113","moved":false,"static":false},
            {"w":3,"h":2,"x":3,"y":0,"i":"1622282842009","moved":false,"static":false},
            {"w":6,"h":2,"x":0,"y":2,"i":"1622282840229","moved":false,"static":false}
            
          ],"md":[],"sm":[{"w":3,"h":2,"x":0,"y":0,"i":"1622282840229","moved":false,"static":false},{"w":3,"h":2,"x":3,"y":0,"i":"1622282842009","moved":false,"static":false}],"xs":[{"w":3,"h":2,"x":0,"y":0,"i":"1622277396501","moved":false,"static":false}]}
        this.setState({
          layouts,
          widgets:layouts.lg
        })
        // 第二步：模拟网络请求获取layouts里的图表
        const arr=['bar','line','pie']
        // 模拟发送请求获取图表数据
        this.state.widgets.forEach((item,index)=>{
          setTimeout(()=>{
            // 模拟获取到图表数据重新赋值widgets
            let widgetsCopy = JSON.parse(JSON.stringify(this.state.widgets))
            widgetsCopy[index].type=arr[index%3]
            console.log('widgetsCopy')
            console.log(widgetsCopy)
            this.setState({
              widgets:widgetsCopy
            })
          },(3-index)*1000)

        })

      },1000)
    })
    
  }

  saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value
        })
      );
    }
  }
  generateDOM = () => {
    console.log('this.state.layouts')
    console.log(this.state.layouts)
    console.log(JSON.stringify(this.state.layouts))
    return _.map(this.state.widgets, (l, i) => {
      let option;
      if (l.type === 'bar') {
        option = getBarChart();
      }else if (l.type === 'line') {
        option = getLineChart();
      }else if (l.type === 'pie') {
        option = getPieChart();
      }
      let component
      if(l.type){
        component= (
          <ReactEcharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{width: '100%',height:'100%'}}
          />
        )
      }else{
        component=<div>loading...</div>
      }
      
      return (
        <div key={l.i} data-grid={l}>
          <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
          {component}
        </div>
      );
    });
  };

  addChart(type) {
    const addItem = {
      x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type,
        }),
      },
    );
  };

  onRemoveItem(i) {
    console.log(this.state.widgets)
    this.setState({
      widgets: this.state.widgets.filter((item,index) => index !=i)
    });

  }

  onLayoutChange(layout, layouts) {
    this.saveToLS("layouts", layouts);
    this.setState({ layouts });
  }

  render() {
   return(
     <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%','padding': '0 30px' }}>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'bar')}>添加柱状图</Button>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'line')}>添加折线图</Button>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'pie')}>添加饼图</Button>
      </Header>
      <Content style={{ marginTop: 44 }}>
        <div style={{ background: '#fff', padding: 20, minHeight: 800 }}>
          <ResponsiveReactGridLayout
            className="layout"
            {...this.props}
            layouts={this.state.layouts}
            onLayoutChange={(layout, layouts) =>
              this.onLayoutChange(layout, layouts)
            }
          >
            {this.generateDOM()}
          </ResponsiveReactGridLayout>
        </div>
      </Content>
    </Layout>
   )}
}
