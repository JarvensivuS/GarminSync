from setuptools import setup, find_packages

setup(
    name='FitnessTracker',             # Replace with your project name
    version='0.1',                        # Replace with your version number
    packages=find_packages(),             # Automatically find all packages
    install_requires=[                    # List your project dependencies
        'SQLAlchemy==2.0.27',
        'python-dateutil==2.8.2',
        'cached-property==1.5.2',
        'tqdm==4.66.2',
        'garth>=0.4.44',
        'fitfile>=1.1.7',
        'tcxfile>=1.0.4',
        'idbutils>=1.1.0',
        'Flask>=3.0.3',
        'garminconnect>=0.1.0'
    ],
    include_package_data=True,            # Include package data as specified in MANIFEST.in
    python_requires='>=3.6',              # Specify Python version requirement
    classifiers=[                         # Add classifiers to describe your package
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Operating System :: OS Independent',
    ],
)
