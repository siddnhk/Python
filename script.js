

function loginmyApp() {
    var username = document.getElementById("uname").value
    var password = document.getElementById("psw").value
    eel.Login_js(username,password);
}


$(function (){
   var alreadyflled = false;
   var store_list;
   var state_list;
   var rep_list;
   var imageNumber;
   var links = [];
   var imageAlreadyfilled = false;
   var dataAlreadyfilled = false;
   var iNum;
   var imageSequence =0;
   if($('body').is('.store')){
        eel.StoreList()(autofil_init);
        iNum =0;
        imageNumber=0;
   } else{
        $.cookie("StoreName", 'Nothing');

   }
   if($('body').is('.Data')){
        eel.StateList()(State_init);
        eel.RepList()(Rep_init);
   }
   $('.Sort_By').click(function(){
            clearTabledata();
            $('.dialogger').addClass('open');
   });
   function buggerall(str){
        console.log(str);
   }
   function State_init(json_str){
    state_list = $.parseJSON(json_str);
    initStateDialog();
   }
   function initStateDialog(){
     $('.Dia_SO').append('<div>All</div>');
     for(var i = 0; i < state_list.length; i++){
            $('.Dia_SO').append('<div>' + state_list[i] + '</div>');
     }
   }
   function Rep_init(json_str){
    rep_list = $.parseJSON(json_str);
    initRepDialog();
   }
   function initRepDialog(){
     $('.Dia_RP').append('<div>All</div>');
     for(var i = 0; i < rep_list.length; i++){
            $('.Dia_RP').append('<div>' + rep_list[i] + '</div>');
     }
   }

    $('body').on('mouseenter','.SO',function(){
        $('.Dia_RP').removeClass('open');
        $('.Dia_SO').addClass('open');
    });
    $('body').on('mouseenter','.RP',function(){
        $('.Dia_SO').removeClass('open');
        $('.Dia_RP').addClass('open');
    });
    $('body').on('click','.Dia_RP > div',function(){
         eel.RepData($(this).text())(initTable);
         eel.RepPivotTable($(this).text())(initPivotTable);
         $('.tableData').addClass('open');
         $('.tablePivot').addClass('open');
    });
     $('body').on('click','.Dia_SO > div',function(){
         eel.SOData($(this).text())(initTable);
         eel.SOPivotTable($(this).text())(initPivotTable);
         $('.tableData').addClass('open');
         $('.tablePivot').addClass('open');
    });

   function initTable(repTabData){
     clearTabledata();
     $('.tableData').append(repTabData);

     var table = $('#Datatable').DataTable( {
          "sScrollX": '100%',
          "lengthMenu":[[4,8,12,16,-1],[4,8,12,16,"All"]]
      } );
        $('#Datatable tbody').on('click', 'tr', function () {
            var data = table.row( this ).data();

            if (confirm('Go to Store '+data[0]+'\'s page?')) {
                $.cookie("StoreName", data[0]);
                window.location.href = "store.html";
            }
        } );
   }
   function initPivotTable(repPivDat){
     $('.tablePivot').append(repPivDat);
     $('#DataPivot').DataTable( {
        "scrollX": true,
        "lengthMenu":[[2,4,6,8,-1],[2,4,6,8,"All"]],
        "scrollY":        "200px",
        "scrollCollapse": true,
        "paging":         false

     });
    }
    function clearTabledata(){
            $('.tableData').removeClass('open');
            $('.tablePivot').removeClass('open');
            $('.tableData').empty();
            $('.tablePivot').empty();
    }


   function autofil_init(json_str){
    store_list = $.parseJSON(json_str);
    initDialog();


   }
   function initDialog(){
     var cookieValue = $.cookie("StoreName");
     getDeets(cookieValue);
     clearDialog();
     for(var i = 0; i < store_list.length; i++){
            $('.dialog').append('<div>' + store_list[i] + '</div>');
     }
    }
    function clearDialog(){
        $('.dialog').empty();
    }
    $('.Search_store input').click(function(){
        if(!alreadyflled){
            $('.dialog').addClass('open');
        }
    });

    $('body').on('click','.dialog > div',function(){
        $('.Search_store input').val($(this).text()).focus();
        $('.Search_store .close').addClass('visible');
        alreadyflled = true;

    });
    $('.Search_store .close').click(function(){
        alreadyflled = false;
        $('.dialog').addClass('open');
        $('.Search_store input').val('').focus();
        $(this).removeClass('visible');
    });

   $('body').mouseup(function(e) {
      var container1 = $('.Search_store input');
      var container2 = $('.dialogger');
      if (!container2.is(e.target) && container2.has(e.target).length === 0)
        {
         $('.dialogger').removeClass('open');
        }
      if (!container1.is(e.target) && container1.has(e.target).length === 0)
        {
         $('.dialog').removeClass('open');
         $('.Dia_SO').removeClass('open');
         $('.Dia_RP').removeClass('open');
        }
   });
   function match(str) {
        str = str.toLowerCase();
        clearDialog();
        for(var i = 0; i < store_list.length; i++){
        if (store_list[0].toLowerCase().includes(str)){
            $('.dialog').append('<div>' + store_list[i] + '</div>');
         }
        }
    }
   $('.Search_store input').on('input', function() {
        $('.dialog').addClass('open');
        alreadyflled = false;
        match($(this).val());
   });
   function setImage(str){
        clearImage();
        $('.image').addClass('open');
        $('.image').append('<img id="zoom_01" src="' + str +'"/><span class="Toggle1">Prev</span><span class="Toggle2">Next</span>');
        imageAlreadyfilled = true;


   }
   function clearImage(){
    if(imageAlreadyfilled === true){
        $('.image').empty();
        imageAlreadyfilled = false;
    }
   }

   function clearData(){
    if(dataAlreadyfilled === true){
        $('.Store_data').empty();
        dataAlreadyfilled = false;
    }
   }
   function SetStoreData(IndiStoreData){
    store_data = $.parseJSON(IndiStoreData);
    clearData();
    $('.Store_data').addClass('open');
    $('.Store_data').append('<h1>'+ store_data['Store Name'] +'</h1>');
    $('.Store_data').append('<div class="Store_data1"><p>State/Online: ' + store_data['State/Online'] +'</p><p>Rep: ' + store_data['Rep'] +'</p><p>Date Account Opened: ' + store_data['DATE ACCOUNT OPENED '] +'</p><p>Address: ' + store_data['Address'] +'</p><p>FW Label: ' + store_data['FW Label'] +'</p><p>Contact Person: ' + store_data['Contact Person'] +'</p><p>Email: ' + store_data['Email'] +'</p><p>Phone Number: ' + store_data['Phone Number'] +'</p></div>');
    $('.Store_data').append('<div class="Store_data2"><p>Sales Jan - Dec 19 ($): ' + store_data['Sales Jan - Dec 19'] +'</p><p>Sales Jan - Dec 18 ($): ' + store_data['Sales Jan - Dec 18'] +'</p><p>Sales Var %: ' + store_data['Sales Var %'] +'</p></div>');

    var myTable = '<div class ="StoreTable"><table><tr><th>Account</th><th>Date Opened</th></tr>';
    if(store_data['Jean Patou'] === '1'){
       myTable += '<tr><td>Jean Patou</td><td>' + store_data['Jean Patou Date'] +'</td></tr>';
    }
    if(store_data['CARVEN'] === '1'){
       myTable += '<tr><td>Carven</td><td>' + store_data['CARVEN Date'] +'</td></tr>';
    }
    if(store_data['Jacques Bogart'] === '1'){
       myTable += '<tr><td>Jacques Bogart</td><td>' + store_data['Jacques Bogart Date'] +'</td></tr>';
    }
    if(store_data['R&R'] === '1'){
       myTable += '<tr><td>R&R</td><td>' + store_data['R&R Date'] +'</td></tr>';
    }
    if(store_data['Shay & Blue'] === '1'){
       myTable += '<tr><td>Shay & Blue</td><td>' + store_data['Shay & Blue Date'] +'</td></tr>';
    }
    if(store_data['Trussardi'] === '1'){
       myTable += '<tr><td>Trussardi</td><td>' + store_data['Trussardi Date'] +'</td></tr>';
    }
    if(store_data['CELEBRITY (AG/J LO) etc'] === '1'){
       myTable += '<tr><td>Celebrity (AG/J LO)</td><td>' + store_data['CELEBRITY (AG/J LO) etc Date'] +'</td></tr>';
    }
    if(store_data['AOL'] === '1'){
       myTable += '<tr><td>AOL</td><td>' + store_data['AOL Date'] +'</td></tr>';
    }
    myTable += '</table></div>';
    $('.Store_data2').append(myTable);

    dataAlreadyfilled = true;
    iNum = parseInt(store_data['Images']);
    rawPath = store_data['ImagePath'].concat('/',store_data['Naming'],'_')
     if(iNum > 0){
            eel.Imagine(rawPath.concat((100),'.JPG'))(setImage);
            for(var i = 0; i < iNum; i++){
                    eel.Imagine(rawPath.concat((100+i),'.JPG'))(imageLinks);
               }
     }

   }
   function imageLinks (str){
        
        links[imageNumber]=str;
        console.log(links[imageNumber]);
        imageNumber++;

   }

   function getDeets(str){
   str = str.toLowerCase();
   matchfound = false;
    for(var i = 0; i < store_list.length; i++){
        if (store_list[i].toLowerCase() === str){
            eel.Storify(i)(SetStoreData);
            matchfound = true;
         }
        }
    if (!matchfound){
        alert('No match found!!');
    }
   }
    $('.image').on('click','.Toggle1',function(){
       if (imageSequence > 0){
            imageSequence--;
            setImage(links[imageSequence]);
        }
    });
    $('.image').on('click','.Toggle2',function(){
        console.log(imageSequence);
       if ((imageSequence) < (iNum-1)){
            imageSequence++;
            setImage(links[imageSequence]);
        }
    });


   $('.Search_store .go').click(function(){
        clearImage();
        getDeets($('.Search_store input').val());
    });




});




