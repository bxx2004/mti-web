export default {

    transferPath(data:any[],size:number){
        let chartData = []
        for (let ele of data) {
            let a = [
                ele.x,
                ele.y
            ]
            chartData.push(a)
        }
        return {
            symbolSize: 15,
            xAxis: {
                interval: 1,
                splitLine: {
                    show: true,
                    lineStyle:{
                        type: "dashed"
                    }
                },
                min: 1,
                max: size,
                position: 'top'
            },
            yAxis: {
                interval: 1,
                splitLine: {
                    show: true,
                    lineStyle:{
                        type: "dashed"
                    }
                },
                min: 1,
                max: size,
                inverse:true
            },
            data: {
                "最优路径": chartData
            },
            series:[
                {
                    name: "adsad",
                    type: "line",
                    data: [[150, 230]]
                }
            ]
        }
    },
    transferSunChart(data:any[]){
        let result = new Map<string,Array<number>>()
        for (let ele of data) {
            let x = ele.x.toString()
            if (result.has(x)){
                let n = result.get(x)!
                n[0] = n[0] + 1
                result.set(x,n)
            }else {
                let n = new Array<number>()
                n[0] = 1
                n[1] = 0
                result.set(x,n)
            }
        }
        for (let ele of data) {
            let y = ele.y.toString()
            if (result.has(y)){
                let n = result.get(y)!
                n[1] = n[1] + 1
                result.set(y,n)
            }else {
                let n = new Array<number>()
                n[0] = 0
                n[1] = 1
                result.set(y,n)
            }
        }
        let chartData = []
        for (let ele of result) {
            let sub = {
                name: ele[0],
                x: ele[1][0],
                y: ele[1][1]
            }
            chartData.push(sub)
        }
        return {
            padding: [35, 100, 50, 20],
            xAxis: {
                data: 'name',
                name: "交配型"
            },
            yAxis: {
                name: '次数'
            },
            data: chartData
        }
    },
    transferHeat(data:any[]){
        let chartData = []
        for (let ele1 of data) {
            for (let ele2 of data){
                let cd =  { Name: ele1.id, Week: ele2.id, Value: -1}
                if (ele1.x !== ele2.x && ele1.y !== ele2.y){
                    cd.Value = 100
                }else {
                    cd.Value = 1
                }
                chartData.push(cd)
            }
        }
        return {
            padding: [35, 100, 50, 20],
            type: 'CalendarHeatMapChart',
            color: ["#FF0000","#008000"],
            borderColor: '#6D8FF0',
            showLabel: false,
            changeProperty: 'color',
            yAxisName: '菌株名称',
            xAxisName: '菌株名称',
            xAxis:{
                labelRotate: 90
            },
            tooltip: {
                show: false,
                formatter: (params:any) => {
                    return "htmlString";
                }
            },
            data: chartData
        }
    }
}