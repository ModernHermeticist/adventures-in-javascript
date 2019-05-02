function removeFromArray(arr, elt)
{
    for (var i = arr.length-1; i >= 0; i--)
    {
        if (arr[i] == elt)
        {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b)
{
    //var d = dist(a.i, a.j, b.i, b.j);
    var d = abs(a.i-b.i) + abs(a.j-b.j);
    return d;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var rows = 25;
var cols = 25;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var noSolution = false;

var w, h;

var path = [];

function Spot(i, j)
{
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.4)
    {
        this.wall = true;
    }

    this.show = function(col)
    {
        fill(col);
        if (this.wall)
        {
            fill(0);
        }
        noStroke();
        rect(this.i * w, this.j * h, w-1, h-1);
    }

    this.addNeighbors = function(grid)
    {
        var i = this.i;
        var j = this.j;
        if (i < cols - 1)
            this.neighbors.push(grid[i + 1][j]);
        if (i > 0)
            this.neighbors.push(grid[i - 1][j]);
        if (j < rows - 1)
            this.neighbors.push(grid[i][j + 1]);
        if (j > 0)
            this.neighbors.push(grid[i][j - 1]);
        if (i > 0 && j > 0)
            this.neighbors.push(grid[i-1][j-1]);
        if (i < cols-1 && j > 0)
            this.neighbors.push(grid[i+1][j-1]);
        if (i > 0 && j < rows-1)
            this.neighbors.push(grid[i-1][j+1]);
        if (i < cols-1 && j < rows-1)
            this.neighbors.push(grid[i+1][j+1]);
    }
}

function setup()
{
    createCanvas(400, 400);
    console.log('A*');

    w = width / cols;
    h = height / rows;

    for (var i = 0; i < cols; i++)
    {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (var i = 0; i < cols; i++) 
    {
        for (var j = 0; j < rows; j++) 
        {
            grid[i][j].addNeighbors(grid);
        }
    }

    //start = grid[getRandomInt(0, rows-1)][getRandomInt(0, rows-1)];
    //end = grid[getRandomInt(0, rows-1)][getRandomInt(0, rows-1)];
    start = grid[0][0];
    end = grid[rows-1][cols-1];
    // This is purely for testing
    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw()
{
    if (openSet.length > 0)
    {
        // keep going
        var lowestIndex = 0;
        for (var i = 0; i < openSet.length; i++)
        {
            if (openSet[i].f < openSet[lowestIndex].f)
            {
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];

        if (current === end)
        {
            noLoop();
            console.log("DONE");
            location.reload();
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++)
        {
            var neighbor = neighbors[i];

            if(!closedSet.includes(neighbor) && !neighbor.wall)
            {
                var tG = current.g + 1;
                if (openSet.includes(neighbor))
                {
                    if (tG < neighbor.g)
                        neighbor.g = tG;
                }
                else
                {
                    neighbor.g = tG;
                    openSet.push(neighbor);
                }
                neighbor.h = heuristic(neighbor,end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
    }
    else
    {
        console.log("No solution!");
        noSolution = true;
        noLoop();
        location.reload();
        // no solution
    }
    background(0);

    for (var i = 0; i < cols; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closedSet.length; i++)
    {
        closedSet[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++)
    {
        openSet[i].show(color(0, 255, 0));
    }

    // Find best path
    if(!noSolution)
    {
        path = [];
        var t = current;
        path.push(t);
        while (t.previous) 
        {
            path.push(t.previous);
            t = t.previous;
        }
    }

    for (var i = 0; i < path.length; i++)
    {
        path[i].show(color(0, 0, 255));
    }

    start.show(color(255, 192, 203));
    end.show(color(255, 165, 0));
}