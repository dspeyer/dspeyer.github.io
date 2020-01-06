#!/usr/bin/python

from qt import *
import sys
import random

rand=random.Random().random

class dirt(QPushButton):
	remaining=0
	wid=0
	tab=0
	def __init__(self, bp):
		QPushButton.__init__(self," ",dirt.wid)
		self.setSizePolicy(QSizePolicy(QSizePolicy.Preferred,QSizePolicy.Preferred))
		QObject.connect(self,SIGNAL("clicked()"),self.uncover)
		self.show()
		self.neighbors=[]
		self.known=0
		self.flagged=0
		self.bomb=(rand()<bp)
		if (self.bomb==0):
			dirt.remaining+=1
		dirt.all.append(self)
	def uncover(self):
		if (self.known==0):
			if (self.bomb):
				self.setText("*")
				for i in dirt.all:
					i.gameOver()
				QMessageBox.information(None,"You Lose","You Lose",0)
			else:
				self.setFlat(1)
				dirt.remaining-=1
				val=0
				for i in self.neighbors:
					if (i.bomb):
						val+=1
				self.known=1
				if (val==0):
					for i in self.neighbors:
						i.uncover()
				else:
					self.setText(str(val))
				if (dirt.remaining==0):
					QMessageBox.information(None,"You Win!","You Win!",0)
	def addNeighbor(self,other):
		if (type(other)!=type(self)):
			return
		if (other==self):
			return
		found=0
		for i in self.neighbors:
			if (i==other):
				found=1
		if (found==0):
			self.neighbors.append(other)
			other.neighbors.append(self)
	def mouseReleaseEvent(self,event):
		if (event.button()==2 and self.known==0):
			if (self.flagged):
				self.flagged=0
				self.setText(" ")
			else:
				self.flagged=1
				self.setText("F")
		if (event.button()>2 and self.known):
			unk=bomb=flag=0	
			for i in self.neighbors:
				if (not i.known):
					unk+=1
				if (i.flagged and not i.known):
					flag+=1
				if (i.bomb):
					bomb+=1
			if (bomb==flag):
				for i in self.neighbors:
					if (not i.flagged):
						i.uncover()
			if (bomb==unk):
				for i in self.neighbors:
					if (not i.known):
						i.flagged=1
						i.setText("F")
		QPushButton.mouseReleaseEvent(self,event)
	def gameOver(self):
		if (self.bomb and not self.flagged):
			self.setText("*")
		if (not(self.bomb) and self.flagged):
			self.setText("X");
		self.known=1

def addDirt(mtx,x,y,xs,ys,bp):
	for xi in range(x,x+xs):
		for yi in range(y,y+ys):
			if (type(mtx[xi+1][yi+1])!=type(0)):
				return
	thedirt=dirt(bp)
	for xi in range(x,x+xs):
		for yi in range(y,y+ys):
			mtx[xi+1][yi+1]=thedirt
	for xi in range(x-1,x+xs+1):
		for yi in range(y-1,y+ys+1):
			thedirt.addNeighbor(mtx[xi+1][yi+1])
	dirt.tab.addMultiCellWidget(thedirt,y,y+ys-1,x,x+xs-1)



def clear():
	dirt.remaining=0
	if (dirt.wid):
		vbox.remove(dirt.wid)
		dirt.wid.destroy()
	dirt.all=[];
	dirt.wid=QFrame(main)
	dirt.wid.setFrameShape(34)
	dirt.wid.setLineWidth(3)
	vbox.addWidget(dirt.wid,1)
	dirt.tab=QGridLayout(dirt.wid)
	dirt.tab.setMargin(4)

def newgame():
	clear()
	fills[algor.currentItem()](sizebox.value(),probbox.value()/100.0)
	dirt.wid.show()

def traditional(side, bombprob):
	mtx=range(side+2)
	for i in range(side+2):
		mtx[i]=range(side+2)
	for x in range(side):
		for y in range(side):
			addDirt(mtx,x,y,1,1,bombprob)

def brick(side, bombprob):
	mtx=range(2*side+3)
	for i in range(2*side+3):
		mtx[i]=range(side+2)
	for x in range(side):
		for y in range(side):
			addDirt(mtx,2*x+y%2,y,2,1,bombprob)

def stagger(side, bombprob):
	mtx=range(4*side+3)
	for i in range(4*side+3):
		mtx[i]=range(side+2)
	for x in range(side):
		for y in range(side):
			addDirt(mtx,4*x+2*(y%2),y,3,1,bombprob)

def patchwork(side, bombprob):
	mtx=range(side+2)
	for i in range(side+2):
		mtx[i]=range(side+2)
	#the number of big tiles should grow quadraticly
	#The specific co-efficients are random -- they play well
	for i in range(side*side/10): 
		addDirt(mtx,(int)(rand()*(side-1)),(int)(rand()*(side-1)),2,2,bombprob)
	for i in range(side*side/10): 
		addDirt(mtx,(int)(rand()*side),(int)(rand()*(side-1)),1,2,bombprob)
	for i in range(side*side/10): 
		addDirt(mtx,(int)(rand()*(side-1)),(int)(rand()*side),2,1,bombprob)
	for x in range(side):
		for y in range(side):
			addDirt(mtx,x,y,1,1,bombprob)

def octag(side,bombprob):
	mtx=range(side+1)
	for i in range(side+1):
		mtx[i]=range(side+1)
	for x in range(side):
		for y in range(side):
			thedirt=dirt(bombprob)
			mtx[x+1][y+1]=thedirt
			thedirt.addNeighbor(mtx[x+1][y])
			thedirt.addNeighbor(mtx[x][y+1])
			dirt.tab.addMultiCellWidget(thedirt,3*y,3*y+2,3*x,3*x+2)
	for x in range(side-1):
		for y in range(side-1):
			thedirt=dirt(bombprob)
			thedirt.addNeighbor(mtx[x+1][y+1])
			thedirt.addNeighbor(mtx[x+2][y+1])
			thedirt.addNeighbor(mtx[x+1][y+2])
			thedirt.addNeighbor(mtx[x+2][y+2])
			dirt.tab.addMultiCellWidget(thedirt,3*y+2,3*y+3,3*x+2,3*x+3)

fills=[traditional, brick, stagger, patchwork, octag]

app=QApplication(sys.argv)
main=QWidget(None)
main.setCaption("Antepenultimate Minesweeper")
app.setMainWidget(main)
vbox=QVBoxLayout(main)

bar=QWidget(main)
vbox.addWidget(bar)
hbox=QHBoxLayout(bar)

hbox.addWidget(QLabel("Size:",bar))

sizebox=QSpinBox(2,50,1,bar)
sizebox.setValue(10)
hbox.addWidget(sizebox)

hbox.addWidget(QLabel("Bomb Percentage:",bar))

probbox=QSpinBox(5,75,5,bar)
probbox.setValue(15)
hbox.addWidget(probbox)

algor=QComboBox(bar)
algor.insertItem("Blocks")
algor.insertItem("Bricks")
algor.insertItem("Staggered")
algor.insertItem("PatchWork")
algor.insertItem("OctaDime")
hbox.addWidget(algor)

but=QPushButton("New Game",bar)
but.ng=newgame
QObject.connect(but,SIGNAL("clicked()"),but.ng)
hbox.addWidget(but)

newgame()
main.show()
app.exec_loop()
