import pandas as pd
import json  


df = pd.read_excel("input.xlsx")
df2 = pd.read_excel("names.xlsx")

links = []
nodes=[]

index = dict()

for i in range(len(df2)):
    index[df2.iloc[i]["Names"]] = i+1

print(index)

for i in range(len(df2)):
    node  = dict()
    node["id"] = i+1
    node["name"] = df2.iloc[i]["Names"]
    nodes.append(node)

print(nodes)


for i in range(1,len(df)):
    link = dict()
    link["source"] = index[df.iloc[i]['source']]
    link["target"]  = df.iloc[i]['target']
    links.append(link)


print(links)


d = dict()

d["nodes"] = nodes
d["links"] = links


# # Serializing json   
# json_object = json.dumps(nodes)  
# print(json_object) 


with open("data.json", "w") as outfile:
    json.dump(d, outfile)