// // Center the map on the ROI
Map.centerObject(ROI, 11);

// Define visualization parameters for false color
var falseColorVis = {bands: ['B8', 'B4', 'B3'], max: 3000};

// Create a picture from the satellite image collection
var picture = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterDate('2020-12-01', '2020-12-31')
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 1))
  .filterBounds(ROI);

print(picture, 'Satellite FCC image');

// Convert the image collection to a list and display it
var list = picture.toList(picture.size());
print(list, 'Data_List');

// Select and clip the second image in the list
var img1 = ee.Image(list.get(0)).clip(ROI);
Map.addLayer(img1, falseColorVis, 'FCC Image');
//dec-0,

// Create an image collection with specific bands
var imgcollection = ee.ImageCollection([ee.Image(list.get(0))])
  .select(['B2', 'B3', 'B4', 'B8']);
print(imgcollection, 'Image Collection');

// Function to stack images
var stack = function(imagecollection) {
  var first = ee.Image(imgcollection.first()).select([]);
  var appendBands = function(image, previous) {
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(imgcollection.iterate(appendBands, first));
};

// Create an image stack
var image_stack = stack(imgcollection);
print(image_stack, 'Image Stack');

// Merge training points from different land cover types
var points = Water.merge(Buildup).merge(Greenspaces).merge(Others);  // Fallowland represents "Others" class
print(points, 'Training points');

// Split the points into training and validation samples
var sample = points.randomColumn();
var trainingsample = sample.filter('random <= 0.8');
var validationsample = sample.filter('random > 0.8');
print(trainingsample, 'Training Sample');
print(validationsample, 'Validation Sample');

// Sample regions for training data
var training = image_stack.sampleRegions({
  collection: trainingsample,
  properties: ['Class'],
  scale: 20
});
print(training, 'Training data band values');

// Sample regions for validation data
var validation = image_stack.sampleRegions({
  collection: validationsample,
  properties: ['Class'],
  scale: 20
});

// Train a Random Forest classifier
var RFclassifier = ee.Classifier.smileRandomForest(100).train(training, 'Class');
var Classified = image_stack.classify(RFclassifier).clip(ROI);
print(Classified, 'Classified');
// // // Train an SVM classifier
// var SVMclassifier = ee.Classifier.libsvm().train(training, 'Class');
// var Classified = image_stack.classify(SVMclassifier).clip(ROI);
// print(Classified, 'Classified');

// Define color palette for the classified map (including "Others" as class 3)
var Palette = ['green', 'blue','red','yellow'];  // Order: Greenspaces, Water, Buildup, Others
Map.addLayer(Classified, {palette: Palette, min: 0, max: 3}, 'Classified Map');

// Validate the classification
var validated = validation.classify(RFclassifier);
//var validated = validation.classify(SVMclassifier);
var validationAccuracy = validated.errorMatrix('Class', 'classification');
print('Validation error matrix', validationAccuracy);
print('Validation accuracy', validationAccuracy.accuracy());

// LULC Area Chart for Vijayawada, with "Others" as class 3
var chart = ui.Chart.image.byClass({
  image: ee.Image.pixelArea().multiply(1e-4).addBands(Classified.rename('classification')),
  classBand: 'classification',
  region: ROI,
  reducer: ee.Reducer.sum(),
  scale: 30,
  classLabels: ['Greenspaces', 'Water', 'Buildup', 'Others']  // Updated to include "Others" as class 3
}).setOptions({
  title: 'LULC Area of Vijayawada',
  vAxis: {title: 'Area (HA)'},
  hAxis: {title: 'Class'},
  colors:['green', 'blue','red','yellow'] // Match class order with "Others" as class 3
});
print(chart);

// Legend
var classNames = ['Greenspaces', 'Water', 'Buildup', 'Others'];
var colors = ['green', 'blue','red','yellow'];

var legend = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {position: 'bottom-left', padding: '8px'}
});

legend.add(ui.Label('Legend', {fontWeight: 'bold', fontSize: '16px'}));

for (var i = 0; i < classNames.length; i++) {
  var colorBox = ui.Label({
    style: {backgroundColor: colors[i], padding: '8px', margin: '2px'}
  });
  var label = ui.Label(classNames[i], {margin: '2px'});
  legend.add(ui.Panel([colorBox, label], ui.Panel.Layout.Flow('horizontal')));
}

Map.add(legend);

/// Create the vegetation mask (Class = 0 for Greenspaces)
var veg = Classified.eq(0);  // Greenspaces
Map.addLayer(veg, {min: 0, max: 1, palette: ['grey', 'green']}, 'Vegetation Map');

// Calculate vegetation area
var areaImage = veg.multiply(ee.Image.pixelArea());
var area = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ROI,
  scale: 30
});

// Define class names and colors for the vegetation legend
var vegClassNames = [ 'Greenspace Areas','Non-Greenspace Areas'];
var vegColors = ['green','grey'];

// Create a new legend panel for vegetation
var vegLegend = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {position: 'bottom-right', padding: '8px'}
});

// Add title to the vegetation legend
vegLegend.add(ui.Label('Legend', {
  fontWeight: 'bold',
  fontSize: '16px',
  margin: '0 0 6px 0'
}));

// Add legend entries for vegetation
for (var i = 0; i < vegClassNames.length; i++) {
  var colorBox = ui.Label('', {
    backgroundColor: vegColors[i],  // This is the fix: `backgroundColor` is directly within the `ui.Label`'s `style`.
    padding: '8px',
    margin: '2px',
    border: '1px solid black'
  });
  var label = ui.Label(vegClassNames[i], {margin: '4px 8px'});
  vegLegend.add(ui.Panel([colorBox, label], ui.Panel.Layout.flow('horizontal')));
}

// Add the vegetation legend to the map
Map.add(vegLegend);



var veg_sqkm = ee.Number(area.get('classification')).divide(1e6);
print('Vegetation area (sq.km) for 2020:', veg_sqkm);
