from setuptools import setup

req = open('./requirements.txt').read().split('\n')

setup(name='Leopold',
      version='0.1.0',
      description='Slack bot for Uproar',
      url='https://github.com/lennee/productivity_utils',
      author='Tristan Smith',
      author_email='tristan.an.smith@gmail.com',
      license='MIT',
      packages=['Leopold'],
      include_package_data=True,
      package_data={
        'Leopold':['creds/*', 'data/*','.env',]
      },
      entry_points={
          'console_scripts': [
              'Leopold = Leopold.__main__:main'
          ]
      },
      install_requires=req,
      zip_safe=True
)
