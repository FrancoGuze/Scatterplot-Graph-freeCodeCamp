const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const container = document.getElementById('container')
const tooltip = document.getElementById('tooltip')
const w = 1200;
const h = 650;

const padding = 30;

fetch(url)
    .then(res => res.json())
    .then(data => {


        const scaleX = d3.scaleTime([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1], [padding, w - padding])
        const axisX = d3.axisBottom(scaleX)
            .tickFormat(d => +d)


        const scaleY = d3.scaleTime([d3.min(data, (d) => d.Seconds), d3.max(data, (d) => d.Seconds)], [padding, h - padding])

        const axisY = d3.axisLeft(scaleY)
            .tickFormat(d => {
                const m = Math.floor(d / 60).toString().padStart(2, 0)
                const s = (d % 60).toString().padStart(2, 0)
                return `${m}:${s}`
            })


        const svg = d3.select(container)
            .append('svg')
            .attr('width', w)
            .attr('height', h)

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', (d, i) => scaleX(d.Year))
            .attr('cy', (d, i) => scaleY(d.Seconds))
            .attr('r', 7)
            .attr('data-xvalue', (d) => d.Year)
            .attr('data-yvalue', (d) => new Date(new Date(1970, 1, 1, 1, d.Time.split(":")[0], d.Time.split(":")[1])))
            .attr('fill', (d) => d.Doping ? 'red' : 'blue')
            .attr('stroke', 'black')
            .on('mouseover',(mouse,d) =>{
                tooltip.innerHTML = `<p>${d.Name} : ${d.Nationality}</p>
                <p>Year: ${d.Year}</p><p>Time: ${d.Time}</p>`
                tooltip.style.display = 'block'
                tooltip.setAttribute('data-year',d.Year)

            })
            .on('mousemove', (mouse,d)=> tooltip.style.transform = `translate(${scaleX(d.Year) + 10}px,${scaleY(d.Seconds) -35}px)`)
            .on('mouseout', () =>tooltip.style.display = 'none')


        svg.append('g')
            .attr('transform', `translate(10,${h - padding})`)
            .attr('id', 'x-axis')
            .call(axisX)

        svg.append('g')
            .attr('transform', `translate(${padding + 10},0)`)
            .attr('id', 'y-axis')
            .call(axisY)

        const legend = svg.append('g')
            .attr('id', 'legend')
            .attr('transform', `translate(${w - 30},${h / 2})`)

        const legend1 = legend.append('g')
            .attr('id', 'legend-label')

        legend1.append('text')
            .text('Doping Allegations')
            .attr('y', -20)
            .attr('text-anchor','end')

        legend1.append('rect')
            .attr('width', 17)
            .attr('height', 17)
            .attr('fill', 'red')
         .attr('y',-33)
         .attr('x',5)

            const legend2 = legend.append('g')
            .attr('id','legend-label')
            
            legend2.append('text')
            .text('No Doping Allegations')
            .attr('y',10)
            .attr('text-anchor','end')

            legend2.append('rect')
            .attr('width', 17)
            .attr('height', 17)
            .attr('fill', 'blue')
         .attr('y',-3)
         .attr('x',5)

    })

