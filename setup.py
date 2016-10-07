from setuptools import setup, find_packages

setup(
    name='migration',
    version='0.0.1',
    description='TC Migration',
    url='https://github.com/taskcluster/migration',
    author='Dustin J. Mitchell',
    author_email='dustin@mozilla.com',
    license='MPL2',
    packages=find_packages(),
    install_requires=[
        'pyyaml',
        'graphviz',
    ],
)

