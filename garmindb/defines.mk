CONF_DIR=C:/Users/samul/.GarminDb
PROJECT_BASE=C:/Users/samul/OneDrive/Opinnaytetyo/FitnessTracker


#
# Handle multiple Python installs. What python are we using?
#
# PLATFORM=$(shell uname) # Remove this if you're not using it on Linux/MacOS

# Manually set the platform if you're on Windows
PLATFORM=Windows

# Default to cmd.exe on Windows
ifeq ($(PLATFORM), Windows)
    SHELL = cmd.exe
    TIME = time
else ifeq ($(PLATFORM), Linux)
    SHELL = /usr/bin/bash
    TIME ?= $(shell which time)
else ifeq ($(PLATFORM), Darwin) # MacOS
    SHELL ?= /usr/bin/bash
    TIME ?= time
else
    TIME ?= $(shell which time)
endif

PYTHON3=python3
PIP3=pip3

PYTHON ?= $(PYTHON3)
PIP ?= $(PIP3)

ifeq ($(PYTHON),)
    $(error Python not found)
endif
ifeq ($(PIP),)
    $(error pip not found)
endif

PIP_PATH = $(shell which ${PIP})

MODULE=garmindb

export MODULE SHELL TIME PLATFORM PYTHON PIP FLAKE8
