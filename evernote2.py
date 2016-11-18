import ENML_PY as eml
from evernote.api.client import EvernoteClient
import evernote.edam.type.ttypes as Types
from evernote.edam.notestore.ttypes import NoteFilter, NotesMetadataResultSpec
from evernote.edam.type.ttypes import NoteSortOrder

dev_token = "S=s1:U=92b72:E=15d4635e1f5:C=155ee84b350:P=1cd:A=en-devtoken:V=2:H=5d718780717abd97ff38f4f5f9944516"
client = EvernoteClient(token=dev_token)
userStore = client.get_user_store()
user = userStore.getUser()
print user.username

noteStore = client.get_note_store()
# notebooks = noteStore.listNotebooks()
# for n in notebooks:
#     print n.name

result_spec = NotesMetadataResultSpec(includeNotebookGuid=True)
filter = NoteFilter(ascending=True)
notes = noteStore.findNotesMetadata(dev_token, filter, 0, 10, result_spec)
for n in notes.notes:
	print n.guid
print '- - -'
html = noteStore.getNoteContent(dev_token, n.guid)
output = open('test.html','w')
output.write(html)
output.close()

print n.guid
note = noteStore.getNote(dev_token, n.guid, True, True, False, False)
# print type(note)
# print vars(note)
# print '- - -'
# print note.title
# print note.content
image = note.resources[0].data.body	
output = open('img.png','w')
output.write(image)
output.close()