import React from 'react'
import ReactEcharts from 'echarts-for-react';


class AsyncComponent extends React.Component{
    static defaultProps = {
        loading: <p>Loading</p>,
        error: <p>Error</p>
    }
    constructor(props){
        super(props)
        this.loaad = this.load.bind(this)
        this.state = {
            module: null
        }
    }

    componentWillMount(){
        this.load(this.props)
    }
    load(props){
        console.log('load')
        console.log(props)
        this.setState({
            module: AsyncComponent.defaultProps.loading
        })
        if(props.config){
            this.setState({
                module: <ReactEcharts
                option={props.option}
                notMerge={true}
                lazyUpdate={true}
                style={{width: '100%',height:'100%'}}
                />
            })
        }
    }
    render(){
        return this.state.module
    }
}
    



export default AsyncComponent