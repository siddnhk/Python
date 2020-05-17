import eel
import dropbox
import pandas as pd
import io
from contextlib import closing
import json

# Initialize Dropbox and get our database into a pandas file

token = "3PCnfDRsSZAAAAAAAAAA9uvWoJSkC-Dtns0m878WaZWsTn8nJt_A2pDqmt9isUza"
dbx = dropbox.Dropbox(token)

# all pandas stuff
yourpath = "/PAP_MasterSheet_Main/PAP Master Sheet Main.csv"


def stream_dropbox_file(path):
    _, res = dbx.files_download(path)
    with closing(res) as result:
        byte_data = result.content
        return io.BytesIO(byte_data)


file_stream = stream_dropbox_file(yourpath)

data = pd.read_csv(file_stream, parse_dates=True, index_col='Index')

eel.init("static")



@eel.expose
def Login_js(x, y):
    print(f"Username {x}, Password {y}")

@eel.expose
def RepList():
    RepLis = data['Rep'].unique().tolist()
    json_str = json.dumps(RepLis)
    print(json_str)
    return json_str

@eel.expose
def StateList():
    StatLis = data['State/Online'].unique().tolist()
    json_str = json.dumps(StatLis)
    print(json_str)
    return json_str

@eel.expose
def StoreList():
    StorLis = data['Store Name'].tolist()
    json_str = json.dumps(StorLis)
    print(json_str)
    return json_str




@eel.expose
def Imagine(x):
    imagePath = x
    print(imagePath)
    ImageLink = dbx.files_get_temporary_link(imagePath)

    return ImageLink.link

@eel.expose
def Storify(x):
    Storedata = data.loc[(x + 1)].astype(str)
    storedict = Storedata.to_dict()
    json_store = json.dumps(storedict)
    print(json_store)
    return json_store

@eel.expose
def RepData(x):
    if x == 'All':
        RepDat = data.loc[ :,'Store Name':'AOL']
    else:
        RepDat = data.loc[data['Rep'].str.contains(x), 'Store Name':'AOL']

    RepHead = '<table id=Datatable class="display nowrap"><thead><tr>'
    for col in RepDat.columns:
        RepHead += '<th>'
        RepHead += col
        RepHead += '</th>'
    RepHead += '</tr></thead>'
    for index, row in RepDat.iterrows():
        Rowstuff = row.to_list()
        Rowstuff = map(str,Rowstuff)
        RepHead += '<tr>'
        for item in Rowstuff:
            RepHead += '<td>'
            RepHead += item
            RepHead += '</td>'
        RepHead += '</tr>'
    RepHead += '</table>'
    print(RepHead)
    return RepHead

@eel.expose
def RepPivotTable(x):
    if x == 'All':
        RepDat = data.loc[ :,'Store Name':'AOL']
    else:
        RepDat = data.loc[data['Rep'].str.contains(x), 'Store Name':'AOL']

    RepFoot = '<table id=DataPivot><thead><tr>'
    column_order = ['AOL', 'CARVEN', 'CELEBRITY (AG/J LO) etc', 'Jacques Bogart', 'Jean Patou', 'R&R', 'Shay & Blue','Trussardi', 'Sales Jan - Dec 18', 'Sales Jan - Dec 19']
    RepTable = (RepDat.pivot_table(index='Rep', margins=True, margins_name='total', aggfunc=sum)).reindex(columns=column_order)
    decimal = 2
    RepTable['Sales Jan - Dec 18'] = RepTable['Sales Jan - Dec 18'].apply(lambda x: round(x,decimal))
    RepTable['Sales Jan - Dec 19'] = RepTable['Sales Jan - Dec 19'].apply(lambda x: round(x, decimal))
    RepTable.reset_index(inplace=True)
    for col in RepTable.columns:
        RepFoot += '<th>'
        RepFoot += col
        RepFoot += '</th>'
    RepFoot += '</tr></thead>'
    for i, (index, row) in enumerate(RepTable.iterrows()):
        Rowstuff = row.to_list()
        Rowstuff = map(str, Rowstuff)
        RepFoot += '<tr>'
       # if i == len(RepTable)-1:
        #    RepFoot += '<tfoot><tr>'
        #    for item in Rowstuff:
         #       RepFoot += '<td>'
         #       RepFoot += item
         #       RepFoot += '</td>'
        #    RepFoot += '</tr></tfoot>'
        for item in Rowstuff:
            RepFoot += '<td>'
            RepFoot += item
            RepFoot += '</td>'
        RepFoot += '</tr>'
    RepFoot += '</table>'

    print(RepFoot)
    return RepFoot

@eel.expose
def SOData(x):
    if x == 'All':
        SODat = data.loc[ :,'Store Name':'AOL']
    else:
        SODat = data.loc[data['State/Online'].str.contains(x), 'Store Name':'AOL']

    SOHead = '<table id=Datatable class="display nowrap"><thead><tr>'
    for col in SODat.columns:
        SOHead += '<th>'
        SOHead += col
        SOHead += '</th>'
    SOHead += '</tr></thead>'
    for index, row in SODat.iterrows():
        Rowstuff = row.to_list()
        Rowstuff = map(str,Rowstuff)
        SOHead += '<tr>'
        for item in Rowstuff:
            SOHead += '<td>'
            SOHead += item
            SOHead += '</td>'
        SOHead += '</tr>'
    SOHead += '</table>'
    print(SOHead)
    return SOHead

@eel.expose
def SOPivotTable(x):
    if x == 'All':
        SODat = data.loc[ :,'Store Name':'AOL']
    else:
        SODat = data.loc[data['State/Online'].str.contains(x), 'Store Name':'AOL']

    SOFoot = '<table id=DataPivot><thead><tr>'
    column_order = ['AOL', 'CARVEN', 'CELEBRITY (AG/J LO) etc', 'Jacques Bogart', 'Jean Patou', 'R&R', 'Shay & Blue','Trussardi', 'Sales Jan - Dec 18', 'Sales Jan - Dec 19']
    SOTable = (SODat.pivot_table(index='State/Online', margins=True, margins_name='total', aggfunc=sum)).reindex(columns=column_order)
    SOTable.reset_index(inplace=True)
    for col in SOTable.columns:
        SOFoot += '<th>'
        SOFoot += col
        SOFoot += '</th>'
    SOFoot += '</tr></thead>'
    for i, (index, row) in enumerate(SOTable.iterrows()):
        Rowstuff = row.to_list()
        Rowstuff = map(str, Rowstuff)
        if i == len(SOTable)-1:
            SOFoot += '<tfoot><tr>'
            for item in Rowstuff:
                SOFoot += '<td>'
                SOFoot += item
                SOFoot += '</td>'
            SOFoot += '</tr></tfoot>'

        SOFoot += '<tr>'
        for item in Rowstuff:
            SOFoot += '<td>'
            SOFoot += item
            SOFoot += '</td>'
        SOFoot += '</tr>'
    SOFoot += '</table>'

    print(SOFoot)
    return SOFoot




eel.start("index.html", size=(1200, 900))
