const gridSize = 30;
const cellSize = 20;
let grid;
let temperatureSlider;
let temperatureValue;
let interactionSlider;
let interactionValue;

function setup() {
  createCanvas(gridSize * cellSize, gridSize * cellSize);
  frameRate(10);
  temperatureSlider = select('#temperature');
  temperatureValue = select('#temperature-value');
  temperatureValue.html(temperatureSlider.value());

  temperatureSlider.input(() => {
    temperatureValue.html(temperatureSlider.value());
  });

  interactionSlider = select('#interaction');
  interactionValue = select('#interaction-value');
  interactionValue.html(interactionSlider.value());

  interactionSlider.input(() => {
    interactionValue.html(interactionSlider.value());
  });

  grid = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    grid[i] = new Array(gridSize);
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, random(TWO_PI));
    }
  }
}

  function draw() {
    background(255);
  
    const temp = map(temperatureSlider.value(), 0, 100, 0, 2);
    const interactionStrength = map(interactionSlider.value(), 0, 100, 0, 2);
  
    const updatesPerFrame = 10; // 每帧更新的矢量数量的因子
  
    for (let k = 0; k < updatesPerFrame; k++) {
      for (let n = 0; n < gridSize * gridSize; n++) {
        const i = floor(random(gridSize));
        const j = floor(random(gridSize));
  
        const neighbors = [
          grid[(i + 1) % gridSize][j],
          grid[(i - 1 + gridSize) % gridSize][j],
          grid[i][(j + 1) % gridSize],
          grid[i][(j - 1 + gridSize) % gridSize],
        ];
  
        const currentEnergy = neighbors.reduce((sum, neighbor) => {
          return sum - interactionStrength * cos(grid[i][j].theta - neighbor.theta);
        }, 0);
  
        const candidateTheta = grid[i][j].theta + random(-PI / 4, PI / 4);
        const candidateEnergy = neighbors.reduce((sum, neighbor) => {
          return sum - interactionStrength * cos(candidateTheta - neighbor.theta);
        }, 0);
  
        const deltaE = candidateEnergy - currentEnergy;
  
        if (deltaE < 0 || random() < exp(-deltaE / temp)) {
          grid[i][j].theta = candidateTheta;
        }
      }
    }
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        grid[i][j].show();
      }
    }
  }
  

  

class Cell {
  constructor(x, y, size, theta) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.theta = theta;
  }

  show() {
    push();
    translate(this.x + this.size / 2, this.y + this.size / 2);
    rotate(this.theta);
    stroke(0);
    strokeWeight(2);
    line(-this.size / 4, 0, this.size / 4, 0);
    pop();
  }
}
