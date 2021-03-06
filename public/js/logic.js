 // will help create hot reloading, meaning new entries in the database will be added to the front-end immediately
  $(document).ready(function(){
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAqNBPCYVsV35mwYRu5tls3BDDU-tw3mPM",
    authDomain: "colorsapp-ec992.firebaseapp.com",
    databaseURL: "https://colorsapp-ec992.firebaseio.com",
    projectId: "colorsapp-ec992",
    storageBucket: "colorsapp-ec992.appspot.com",
    messagingSenderId: "1022391477106"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// READ OPERATION
function readAll() {
firebase.database().ref('/colors').on('value', function(snapshot) {
  var table = $('.colorsTable');
  // prevent duplication of table rows
  $(".colorsTable").find("tr:gt(0)").remove();
  var readData = snapshotToArray(snapshot);
  for (let i=0;  i < readData.length; i++) {
    let key = readData[i].key;
    table.append("<tr style='color:" + readData[i].hexCode + "'><td class='colorFld'>" +
    readData[i].colorName + "<td class='hexFld'>" + 
    readData[i].hexCode + "</td>" + "<td class='rgbFld'>" + 
    readData[i].rgb + "</td>" + "<td class='categoryFld'>" + 
    readData[i].category + "</td>" + "<td class='actions'>" + 
    "<button class='btn-danger dltButton btn' onclick='deleteRow(" + 
     "`" + key + "`" + ")'>Delete</button><button class='btn-success edtButton btn' onclick='editRow(" + 
     "`" + key + "`" + ")'>Edit</button>" + "</td></tr>");
  }
});
};

// Read All from Database when page first loads
readAll();

// Clear Searches
$('.clear').on('click', function(){
  $('#searchBox').val('');
  readAll();
});

// CREATE OPERATION
  $('#submitColor').on('click', function(){
    event.preventDefault();

    let colorName = $('#colorName').val().toLowerCase();
    let hexCode = $('#hex-code').val();
    let rgb = $('#RGB').val();
    let category = $('#category').val();

    var duplicate = checkForExistingColors(colorName);
    if (!duplicate){
    firebase.database().ref('colors/').push({
      colorName: colorName,
      hexCode: hexCode,
      rgb: rgb,
      category: category
    });
    $('#colorModal').toggle();
    $('.modal-backdrop').remove();
    } else {
        alert('There is already a color with this name.');
    }
  });

});

  // DELETE OPERATION
  function deleteRow(key){
    firebase.database().ref('colors/' + key).remove();
  }

    // UPDATE OPERATION
    function editRow(key){
      $('#updateColorModal').modal('show');
      firebase.database().ref('/colors/' + key).once('value').then(function(snapshot) {
      $('#updateColorName').val(snapshot.val().colorName);
      $('#updateHex').val(snapshot.val().hexCode);
      $('#updateRGB').val(snapshot.val().rgb);
      $('#updateCategory').val(snapshot.val().category);
      })

      $('#updateColor').on('click', function() {
        event.preventDefault();
            
        // forcing lowercase so that search functionality will be case-sensitive
            let colorName = $('#updateColorName').val().toLowerCase();
            let hexCode = $('#updateHex').val();
            let rgb = $('#updateRGB').val();
            let category = $('#updateCategory').val();

            firebase.database().ref('colors/' + key).update({
              colorName: colorName,
              hexCode: hexCode,
              rgb: rgb,
              category: category
            });

            $('#updateColorModal').modal('hide');
            $('.modal-backdrop').remove();
          });
        }

  // SEARCH OPERATION
  function search(){
  var parameter = $('#searchBox').val().toLowerCase();
  firebase.database().ref('colors').orderByChild('colorName').startAt(parameter).endAt(parameter+"\uf8ff").on("value", function(snapshot) {
    console.log(snapshot.val());
    var table = $('.colorsTable');
    table.find("tr:gt(0)").remove();
    snapshot.forEach(function(data) {
      var readData = snapshotToArray(snapshot);
      for (let i=0;  i < readData.length; i++) {
        let key = readData[i].key;
        table.append("<tr style='color:" + readData[i].hexCode + "'><td class='colorFld'>" +
        readData[i].colorName + "<td class='hexFld'>" + 
        readData[i].hexCode + "</td>" + "<td class='rgbFld'>" + 
        readData[i].rgb + "</td>" + "<td class='categoryFld'>" + 
        readData[i].category + "</td>" + "<td class='actions'>" + 
        "<button class='btn-danger dltButton btn' onclick='deleteRow(" + 
         "`" + key + "`" + ")'>Delete</button><button class='btn-success edtButton btn' onclick='editRow(" + 
         "`" + key + "`" + ")'>Edit</button>" + "</td></tr>");
      }
    });
});
  };
  
function snapshotToArray(snapshot){
  var returnArr = [];

  snapshot.forEach(function(childSnapshot){
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  })

  return returnArr;
};

function checkForExistingColors(name){
    var value = this.value;
    var match = false;
    $("table").find("tr").each(function(index) {
        if (!index) return;
        var id = $(this).find("td").first().text();
        if (id == name){
         match = true;
        }
    })
  if (match) {
    return true;
  } else {
    return false;
  }
  };