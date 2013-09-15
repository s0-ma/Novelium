#! /usr/bin/python
# -*- coding:utf-8 -*-

#このプログラムは、Novelium Scriptの会話文整形を行うためのものです。

import sys

def splitStr(str, num):
		num += 2
		l = []
		str_length = len(str)
		for i in range(0,str_length/num+1):
				l.append(str[i*num:(i+1)*num])
		return l

if __name__ == "__main__":
		#open file
		try:
				if(len(sys.argv) != 2):
						print "argv error!"
				f = open(sys.argv[1])
		except:
				print "open file error!"
				sys.exit()

		#variables
		isSpeaking = False
		QuateChar = u"」"
		maxSentLength = 30

		#read file
		for line in f.readlines():
				line = line.decode("utf-8")
				#命令文
				if line.startswith(u"."):
						print line.encode("utf-8"),

				#会話文
				elif line.startswith(u"%"):
						name = line.partition(u" ")[0]
						sent = line.partition(u" ")[2]
						for text in splitStr(sent,maxSentLength):
								print name.encode("utf-8") + u" ".encode("utf-8") + text.replace(u"\n","").encode("utf-8")
						#閉じカッコが無ければ
						if(line.find(QuateChar) != -1):
								isSpeaking = False
						#閉じカッコが存在すれば
						else:
								isSpeaking = True

				#地の文
				else:
						if(line == u"\n"):
								print line.encode("utf-8"),
						elif(isSpeaking == True):
								print name.encode("utf-8")+u" ".encode("utf-8")+line.encode("utf-8"),
								if(line.find(QuateChar) != -1):
										isSpeaking = False
										
						else:
								for text in splitStr(line,maxSentLength):
										print text.replace(u"\n","").encode("utf-8")

